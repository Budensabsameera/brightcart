package com.ecommerce.backend.auth;

public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException() {
        super("Authentication required");
    }
}
