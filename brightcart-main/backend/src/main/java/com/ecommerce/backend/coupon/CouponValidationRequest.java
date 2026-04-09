package com.ecommerce.backend.coupon;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CouponValidationRequest(
        @NotBlank(message = "cannot be empty") String code,
        @NotNull(message = "cannot be empty") @Min(value = 0, message = "cannot be negative") Integer subtotal
) {
}
