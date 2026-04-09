package com.ecommerce.backend.auth;

public record UserSessionResponse(
        Long id,
        String name,
        String email,
        String role,
        String phone
) {
}
