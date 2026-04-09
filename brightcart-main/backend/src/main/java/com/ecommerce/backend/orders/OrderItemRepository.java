package com.ecommerce.backend.orders;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {

    List<OrderItemEntity> findByOrder(OrderEntity order);

    long countByProductId(Long productId);
}
