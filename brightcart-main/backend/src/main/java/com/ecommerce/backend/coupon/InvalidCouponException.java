package com.ecommerce.backend.coupon;

public class InvalidCouponException extends RuntimeException {

    public InvalidCouponException(String message) {
        super(message);
    }
}
