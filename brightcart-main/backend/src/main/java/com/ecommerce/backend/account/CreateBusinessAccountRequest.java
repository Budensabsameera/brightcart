package com.ecommerce.backend.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateBusinessAccountRequest(
        @NotBlank(message = "cannot be empty")
        @Size(max = 120, message = "must be 120 characters or fewer")
        String businessName,
        @NotBlank(message = "cannot be empty")
        @Size(max = 80, message = "must be 80 characters or fewer")
        String businessType,
        String phone,
        String gstNumber
) {
}
