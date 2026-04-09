package com.ecommerce.backend.coupon;

public record CouponValidationResponse(
        String code,
        String description,
        String discountType,
        Integer discountValue,
        Integer minOrderAmount,
        Integer discountAmount
) {
}
