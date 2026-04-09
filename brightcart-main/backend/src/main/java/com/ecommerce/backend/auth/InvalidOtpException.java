package com.ecommerce.backend.auth;

public class InvalidOtpException extends RuntimeException {

    public InvalidOtpException() {
        super("Invalid OTP");
    }
}
