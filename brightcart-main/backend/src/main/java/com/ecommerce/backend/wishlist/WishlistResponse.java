package com.ecommerce.backend.wishlist;

import java.util.List;

public record WishlistResponse(
        List<WishlistItemResponse> items,
        Integer totalItems
) {
}
