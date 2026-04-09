package com.ecommerce.backend.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart(Cart cart);

    Optional<CartItem> findByCartAndProductId(Cart cart, Long productId);

    void deleteByCart(Cart cart);

    void deleteByProductId(Long productId);
}
