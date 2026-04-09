package com.ecommerce.backend.wishlist;

public record WishlistItemResponse(
        Long productId,
        String name,
        String category,
        String description,
        Integer price,
        Integer originalPrice,
        Integer stockQuantity,
        String savings,
        String rating,
        String tag,
        String image
) {
}
