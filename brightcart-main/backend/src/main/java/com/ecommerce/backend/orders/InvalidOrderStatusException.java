package com.ecommerce.backend.orders;

public class InvalidOrderStatusException extends RuntimeException {

    public InvalidOrderStatusException(String status) {
        super("Invalid order status: " + status);
    }
}
