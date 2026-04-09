package com.ecommerce.backend.wishlist;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByWishlistOrderByCreatedAtDesc(Wishlist wishlist);

    Optional<WishlistItem> findByWishlistAndProductId(Wishlist wishlist, Long productId);

    void deleteByProductId(Long productId);
}
