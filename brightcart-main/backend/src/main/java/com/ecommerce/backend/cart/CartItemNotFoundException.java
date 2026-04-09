package com.ecommerce.backend.cart;

public class CartItemNotFoundException extends RuntimeException {

    public CartItemNotFoundException(Long productId) {
        super("Cart item not found for product: " + productId);
    }
}
