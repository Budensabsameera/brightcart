package com.ecommerce.backend.catalog;

public class CategoryDeleteBlockedException extends RuntimeException {

    public CategoryDeleteBlockedException(String categoryName) {
        super("Category \"" + categoryName + "\" cannot be deleted because products are still assigned to it");
    }
}
