package com.ecommerce.backend.orders;

public record OrderItemResponse(
        Long productId,
        String name,
        Integer price,
        Integer quantity
) {
}
