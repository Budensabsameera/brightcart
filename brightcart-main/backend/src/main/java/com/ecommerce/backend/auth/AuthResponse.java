package com.ecommerce.backend.auth;

public record AuthResponse(
        String token,
        UserSessionResponse user
) {
}
