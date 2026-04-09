package com.ecommerce.backend.orders;

public class EmptyCartException extends RuntimeException {

    public EmptyCartException() {
        super("Cart is empty");
    }
}
