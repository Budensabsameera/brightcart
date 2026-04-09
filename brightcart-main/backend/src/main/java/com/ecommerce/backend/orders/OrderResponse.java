package com.ecommerce.backend.orders;

import java.util.List;

public record OrderResponse(
        Long orderId,
        String customerName,
        String address,
        String phone,
        List<OrderItemResponse> items,
        Integer subtotal,
        Integer shipping,
        String couponCode,
        Integer discountAmount,
        Integer total
) {
}
