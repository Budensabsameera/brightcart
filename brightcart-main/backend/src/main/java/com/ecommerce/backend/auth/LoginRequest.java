package com.ecommerce.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @Email(message = "must be a valid email address")
        @NotBlank(message = "cannot be empty")
        String email,
        @NotBlank(message = "cannot be empty")
        @Size(min = 6, message = "must be at least 6 characters")
        String password
) {
}
