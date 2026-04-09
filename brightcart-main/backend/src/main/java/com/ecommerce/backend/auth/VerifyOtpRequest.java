package com.ecommerce.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
        @Email(message = "must be a valid email address")
        @NotBlank(message = "cannot be empty")
        String email,
        @NotBlank(message = "cannot be empty")
        String otp
) {
}
