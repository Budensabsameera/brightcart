package com.ecommerce.backend.catalog;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException(Long productId) {
        super("Product not found: " + productId);
    }
}
