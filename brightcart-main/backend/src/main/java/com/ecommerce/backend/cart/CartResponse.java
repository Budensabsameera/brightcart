package com.ecommerce.backend.cart;

import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        Integer subtotal,
        Integer shipping,
        Integer totalItems,
        Integer total
) {
}
