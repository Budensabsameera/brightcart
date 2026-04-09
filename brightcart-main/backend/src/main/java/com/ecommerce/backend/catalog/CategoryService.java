package com.ecommerce.backend.catalog;

import jakarta.transaction.Transactional;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EDGE_HYPHENS = Pattern.compile("(^-|-$)");

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryUpsertRequest request) {
        Category category = new Category();
        applyRequest(category, request);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long categoryId, CategoryUpsertRequest request) {
        Category category = findEntityById(categoryId);
        applyRequest(category, request);
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long categoryId) {
        Category category = findEntityById(categoryId);

        if (productRepository.countByCategoryId(categoryId) > 0) {
            throw new CategoryDeleteBlockedException(category.getName());
        }

        categoryRepository.delete(category);
    }

    @Transactional
    public Category findEntityById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));
    }

    private void applyRequest(Category category, CategoryUpsertRequest request) {
        String normalizedName = request.name().trim();
        category.setName(normalizedName);
        category.setSlug(buildUniqueSlug(normalizedName, category.getId()));
        category.setDescription(request.description().trim());
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription()
        );
    }

    private String buildUniqueSlug(String value, Long currentCategoryId) {
        String baseSlug = slugify(value);
        List<Category> existingCategories = categoryRepository.findAll().stream()
                .filter(category -> !Objects.equals(category.getId(), currentCategoryId))
                .sorted(Comparator.comparing(Category::getId))
                .toList();

        String candidate = baseSlug;
        int suffix = 2;

        while (hasSlug(existingCategories, candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }

        return candidate;
    }

    private boolean hasSlug(List<Category> categories, String candidate) {
        for (Category category : categories) {
            if (category.getSlug().equals(candidate)) {
                return true;
            }
        }

        return false;
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        slug = WHITESPACE.matcher(slug).replaceAll("-");
        slug = EDGE_HYPHENS.matcher(slug).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
