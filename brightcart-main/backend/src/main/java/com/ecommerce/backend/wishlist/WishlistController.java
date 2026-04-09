package com.ecommerce.backend.wishlist;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public WishlistResponse wishlist() {
        return wishlistService.getWishlist();
    }

    @PostMapping("/items/{productId}")
    public WishlistResponse addItem(@PathVariable Long productId) {
        return wishlistService.addItem(productId);
    }

    @DeleteMapping("/items/{productId}")
    public WishlistResponse removeItem(@PathVariable Long productId) {
        return wishlistService.removeItem(productId);
    }
}
