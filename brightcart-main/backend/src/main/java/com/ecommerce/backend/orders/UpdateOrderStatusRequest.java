package com.ecommerce.backend.orders;

import jakarta.validation.constraints.NotBlank;

public record UpdateOrderStatusRequest(
        @NotBlank(message = "cannot be empty") String status
) {
}
