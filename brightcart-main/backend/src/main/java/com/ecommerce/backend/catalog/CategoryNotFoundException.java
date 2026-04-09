package com.ecommerce.backend.catalog;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long categoryId) {
        super("Category " + categoryId + " was not found");
    }
}
