package com.ecommerce.backend.coupon;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CouponUpsertRequest(
        @NotBlank(message = "cannot be empty") String code,
        @NotBlank(message = "cannot be empty") String description,
        @NotBlank(message = "cannot be empty") String discountType,
        @NotNull(message = "cannot be empty") @Min(value = 1, message = "must be greater than 0") Integer discountValue,
        @NotNull(message = "cannot be empty") @Min(value = 0, message = "cannot be negative") Integer minOrderAmount,
        @NotNull(message = "cannot be empty") Boolean active
) {
}
