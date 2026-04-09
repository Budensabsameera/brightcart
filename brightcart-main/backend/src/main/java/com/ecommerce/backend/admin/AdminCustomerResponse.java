package com.ecommerce.backend.admin;

public record AdminCustomerResponse(
        Long id,
        String name,
        String email,
        String phone,
        String role,
        String status
) {
}
