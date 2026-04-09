package com.ecommerce.backend.coupon;

public class CouponNotFoundException extends RuntimeException {

    public CouponNotFoundException(Long couponId) {
        super("Coupon " + couponId + " was not found");
    }
}
