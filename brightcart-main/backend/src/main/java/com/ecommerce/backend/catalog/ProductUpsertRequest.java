package com.ecommerce.backend.catalog;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductUpsertRequest(
        @NotBlank(message = "cannot be empty") String name,
        @NotBlank(message = "cannot be empty") String category,
        @NotBlank(message = "cannot be empty") String description,
        @NotNull(message = "cannot be empty") @Min(value = 1, message = "must be greater than 0") Integer price,
        @NotNull(message = "cannot be empty") @Min(value = 1, message = "must be greater than 0") Integer originalPrice,
        @NotNull(message = "cannot be empty") @Min(value = 0, message = "cannot be negative") Integer stockQuantity,
        @NotBlank(message = "cannot be empty") String savings,
        @NotBlank(message = "cannot be empty") String rating,
        @NotBlank(message = "cannot be empty") String tag,
        @NotBlank(message = "cannot be empty") String image
) {
}
