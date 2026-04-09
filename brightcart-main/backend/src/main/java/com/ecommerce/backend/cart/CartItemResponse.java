package com.ecommerce.backend.cart;

public record CartItemResponse(
        Long productId,
        String name,
        String category,
        Integer price,
        Integer quantity,
        String image,
        Integer stockQuantity
) {
}
