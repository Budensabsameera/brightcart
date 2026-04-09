package com.ecommerce.backend.auth;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String email) {
        super("User not found: " + email);
    }
}
