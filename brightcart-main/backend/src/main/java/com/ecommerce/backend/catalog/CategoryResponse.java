package com.ecommerce.backend.catalog;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description
) {
}
