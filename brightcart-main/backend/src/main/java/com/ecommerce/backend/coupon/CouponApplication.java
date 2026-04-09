package com.ecommerce.backend.coupon;

public record CouponApplication(
        String code,
        String description,
        String discountType,
        Integer discountValue,
        Integer minOrderAmount,
        Integer discountAmount
) {
}
