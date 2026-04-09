package com.ecommerce.backend.orders;

public class InvalidOrderCancellationException extends RuntimeException {

    public InvalidOrderCancellationException(String status) {
        super("Order cannot be cancelled when status is " + status + ".");
    }
}
