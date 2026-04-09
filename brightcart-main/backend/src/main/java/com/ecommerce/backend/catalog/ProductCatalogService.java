package com.ecommerce.backend.catalog;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;
import com.ecommerce.backend.cart.CartItemRepository;
import com.ecommerce.backend.orders.OrderItemRepository;
import com.ecommerce.backend.wishlist.WishlistItemRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductCatalogService {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Pattern EDGE_HYPHENS = Pattern.compile("(^-|-$)");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final OrderItemRepository orderItemRepository;

    public ProductCatalogService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            CartItemRepository cartItemRepository,
            WishlistItemRepository wishlistItemRepository,
            OrderItemRepository orderItemRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cartItemRepository = cartItemRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @PostConstruct
    @Transactional
    public void ensureSeedData() {
        if (productRepository.count() > 0) {
            return;
        }

        List<ProductUpsertRequest> seedProducts = List.of(
                new ProductUpsertRequest("Aurora Wireless Headphones", "Electronics",
                        "Premium immersive audio with calm-fit cushioning for work, travel, and deep focus.",
                        8999, 11999, 50, "25%", "4.8", "Best Seller",
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Citrus Everyday Sneakers", "Fashion",
                        "Lightweight sneakers built for city walks, soft landings, and effortless everyday styling.",
                        4299, 5699, 60, "24%", "4.6", "New In",
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Halo Ceramic Lamp", "Home Living",
                        "A warm ambient lamp that layers soft light and sculptural texture into any room.",
                        3199, 4499, 30, "29%", "4.7", "Editor Pick",
                        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Solstice Linen Chair", "Home Living",
                        "Rounded lounge comfort and soft natural tones for flexible, design-forward living spaces.",
                        12499, 15999, 15, "22%", "4.9", "Trending",
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Verdant Smart Watch", "Electronics",
                        "A sleek everyday wearable with fitness insights, vivid display, and elegant minimal styling.",
                        14999, 18999, 25, "21%", "4.7", "Hot Pick",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30e?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Sunline Desk Speaker", "Electronics",
                        "Compact wireless audio tuned for home desks, low-key evenings, and crisp spoken sound.",
                        5499, 6999, 35, "21%", "4.5", "Popular",
                        "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Aero Travel Backpack", "Essentials",
                        "Lightweight urban backpack with smart storage, laptop padding, and daily commute comfort.",
                        3799, 4999, 45, "24%", "4.6", "Trending",
                        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Monarch Coffee Table", "Home Living",
                        "Minimal wooden table built for bright living rooms and everyday utility.",
                        8999, 11999, 20, "25%", "4.8", "Editor Pick",
                        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Nova Air Fryer", "Essentials",
                        "Compact kitchen essential for quick snacks, lighter meals, and everyday convenience.",
                        6299, 7999, 40, "21%", "4.7", "Hot Deal",
                        "https://images.unsplash.com/photo-1585515656614-6f3f7f85c8d1?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Velo Running Jacket", "Fashion",
                        "Light outer layer for morning runs, weekend travel, and breezy city commutes.",
                        2899, 3999, 50, "28%", "4.5", "New In",
                        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Mira Glass Water Bottle", "Essentials",
                        "A sleek everyday bottle with a clean silhouette and easy carry loop.",
                        999, 1399, 80, "29%", "4.6", "Daily Pick",
                        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Orbit Table Clock", "Home Living",
                        "Compact modern clock for desks, side tables, and calm workspaces.",
                        1799, 2499, 55, "28%", "4.4", "Fresh Find",
                        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"),
                new ProductUpsertRequest("Arc Mechanical Keyboard", "Electronics",
                        "Compact tactile keyboard with a cleaner profile for work, gaming, and creator setups.",
                        6999, 8999, 32, "22%", "4.8", "Top Rated",
                        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80")
        );

        seedProducts.forEach(this::create);
    }

    @Transactional
    public List<ProductResponse> findAll() {
        return productRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(this::toProductResponse)
                .toList();
    }

    @Transactional
    public ProductResponse findById(Long productId) {
        return toProductResponse(findEntityById(productId));
    }

    @Transactional
    public ProductResponse create(ProductUpsertRequest request) {
        Product product = new Product();
        applyRequest(product, request);
        return toProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long productId, ProductUpsertRequest request) {
        Product product = findEntityById(productId);
        applyRequest(product, request);
        return toProductResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long productId) {
        Product product = findEntityById(productId);

        if (orderItemRepository.countByProductId(productId) > 0) {
            throw new ProductDeleteBlockedException(product.getName());
        }

        cartItemRepository.deleteByProductId(productId);
        wishlistItemRepository.deleteByProductId(productId);
        productRepository.delete(product);
    }

    @Transactional
    public Product findEntityById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));
    }

    private void applyRequest(Product product, ProductUpsertRequest request) {
        Category category = resolveCategory(request.category().trim());
        product.setCategory(category);
        product.setName(request.name().trim());
        product.setSlug(buildUniqueSlug(request.name().trim(), product.getId()));
        product.setDescription(request.description().trim());
        product.setPrice(request.price());
        product.setOriginalPrice(request.originalPrice());
        product.setStockQuantity(request.stockQuantity());
        product.setImageUrl(request.image().trim());
        product.setIsFeatured(isFeaturedTag(request.tag()) ? 1 : 0);
        product.setRating(request.rating().trim());
        product.setTag(request.tag().trim());
    }

    private Category resolveCategory(String categoryName) {
        return categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(categoryName);
                    category.setSlug(slugify(categoryName));
                    category.setDescription(categoryName + " collection");
                    return categoryRepository.save(category);
                });
    }

    private ProductResponse toProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getCategory().getName(),
                product.getDescription(),
                product.getPrice(),
                product.getOriginalPrice(),
                product.getStockQuantity(),
                calculateSavings(product.getPrice(), product.getOriginalPrice()),
                product.getRating(),
                product.getTag(),
                product.getImageUrl()
        );
    }

    private String calculateSavings(Integer price, Integer originalPrice) {
        if (price == null || originalPrice == null || originalPrice <= 0 || originalPrice <= price) {
            return "0%";
        }

        double ratio = ((double) (originalPrice - price) / originalPrice) * 100;
        return Math.round(ratio) + "%";
    }

    private boolean isFeaturedTag(String tag) {
        String normalizedTag = tag == null ? "" : tag.trim().toLowerCase(Locale.ENGLISH);
        return List.of("best seller", "editor pick", "top rated", "trending").contains(normalizedTag);
    }

    private String buildUniqueSlug(String value, Long currentProductId) {
        String baseSlug = slugify(value);
        List<Product> existingProducts = productRepository.findAll().stream()
                .filter(product -> !Objects.equals(product.getId(), currentProductId))
                .sorted(Comparator.comparing(Product::getId))
                .toList();

        String candidate = baseSlug;
        int suffix = 2;

        while (hasSlug(existingProducts, candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }

        return candidate;
    }

    private boolean hasSlug(List<Product> products, String candidate) {
        for (Product product : products) {
            if (product.getSlug().equals(candidate)) {
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
