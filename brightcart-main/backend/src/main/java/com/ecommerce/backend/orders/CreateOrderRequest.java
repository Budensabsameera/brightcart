package com.ecommerce.backend.orders;

import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank(message = "cannot be empty") String name,
        @NotBlank(message = "cannot be empty") String address,
        @NotBlank(message = "cannot be empty") String phone,
        String couponCode
) {
}
