package com.ecommerce.backend.coupon;

public record CouponResponse(
        Long id,
        String code,
        String description,
        String discountType,
        Integer discountValue,
        Integer minOrderAmount,
        boolean active
) {
}
