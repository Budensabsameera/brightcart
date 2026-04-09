package com.ecommerce.backend.auth;

public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("You do not have permission to perform this action");
    }
}
