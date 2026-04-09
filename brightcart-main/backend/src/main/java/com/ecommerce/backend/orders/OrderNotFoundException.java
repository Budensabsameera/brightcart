package com.ecommerce.backend.orders;

public class OrderNotFoundException extends RuntimeException {

    public OrderNotFoundException(Long orderId) {
        super("Order not found: " + orderId);
    }
}
