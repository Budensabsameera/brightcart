package com.ecommerce.backend.catalog;

import com.ecommerce.backend.auth.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CurrentUserService currentUserService;

    public CategoryController(CategoryService categoryService, CurrentUserService currentUserService) {
        this.categoryService = categoryService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<CategoryResponse> categories() {
        return categoryService.findAll();
    }

    @PostMapping
    public CategoryResponse createCategory(@Valid @RequestBody CategoryUpsertRequest request) {
        currentUserService.requireAdmin();
        return categoryService.create(request);
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryUpsertRequest request
    ) {
        currentUserService.requireAdmin();
        return categoryService.update(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId) {
        currentUserService.requireAdmin();
        categoryService.delete(categoryId);
    }
}
