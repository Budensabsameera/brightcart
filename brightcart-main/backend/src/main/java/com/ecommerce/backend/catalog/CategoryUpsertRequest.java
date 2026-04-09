package com.ecommerce.backend.catalog;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpsertRequest(
        @NotBlank(message = "cannot be empty") String name,
        @NotBlank(message = "cannot be empty") String description
) {
}
