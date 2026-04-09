package com.ecommerce.backend.orders;

import java.time.LocalDateTime;
import java.util.List;

public record OrderHistoryResponse(
        Long orderId,
        String status,
        LocalDateTime createdAt,
        LocalDateTime placedAt,
        LocalDateTime processingAt,
        LocalDateTime shippedAt,
        LocalDateTime deliveredAt,
        LocalDateTime cancelledAt,
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
