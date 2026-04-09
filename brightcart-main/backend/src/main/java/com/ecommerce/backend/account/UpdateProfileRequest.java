package com.ecommerce.backend.account;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "cannot be empty") String name,
        String phone
) {
}
