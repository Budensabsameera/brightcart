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
@RequestMapping("/api/products")
public class ProductController {

    private final ProductCatalogService productCatalogService;
    private final CurrentUserService currentUserService;

    public ProductController(
            ProductCatalogService productCatalogService,
            CurrentUserService currentUserService
    ) {
        this.productCatalogService = productCatalogService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ProductResponse> products() {
        return productCatalogService.findAll();
    }

    @GetMapping("/{productId}")
    public ProductResponse productById(@PathVariable Long productId) {
        return productCatalogService.findById(productId);
    }

    @PostMapping
    public ProductResponse createProduct(@Valid @RequestBody ProductUpsertRequest request) {
        currentUserService.requireAdmin();
        return productCatalogService.create(request);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpsertRequest request
    ) {
        currentUserService.requireAdmin();
        return productCatalogService.update(productId, request);
    }

    @DeleteMapping("/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        currentUserService.requireAdmin();
        productCatalogService.delete(productId);
    }
}
