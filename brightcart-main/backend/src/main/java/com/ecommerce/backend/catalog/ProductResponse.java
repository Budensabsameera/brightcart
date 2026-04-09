package com.ecommerce.backend.catalog;

public record ProductResponse(
        Long id,
        String name,
        String category,
        String description,
        Integer price,
        Integer originalPrice,
        Integer stockQuantity,
        String savings,
        String rating,
        String tag,
        String image
) {
}
