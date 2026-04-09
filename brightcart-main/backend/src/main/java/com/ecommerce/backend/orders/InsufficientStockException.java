package com.ecommerce.backend.orders;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(String productName, int requestedQuantity, int availableQuantity) {
        super("Only " + availableQuantity + " item(s) left for " + productName
                + ". Requested quantity: " + requestedQuantity + ".");
    }
}
