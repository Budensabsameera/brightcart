package com.ecommerce.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @Email(message = "must be a valid email address")
        @NotBlank(message = "cannot be empty")
        String email
) {
}
