package com.ecommerce.backend.auth;

public record OtpResponse(
        String message,
        String otp
) {
}
