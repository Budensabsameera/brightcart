package com.ecommerce.backend.catalog;

public class ProductDeleteBlockedException extends RuntimeException {

    public ProductDeleteBlockedException(String productName) {
        super(productName + " cannot be deleted because it is already part of placed orders.");
    }
}
