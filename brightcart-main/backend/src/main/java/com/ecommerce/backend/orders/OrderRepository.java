package com.ecommerce.backend.orders;

import com.ecommerce.backend.auth.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    List<OrderEntity> findByUserOrderByCreatedAtDesc(User user);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    long countByOrderStatus(String orderStatus);

    @Query("select coalesce(sum(o.totalAmount), 0) from OrderEntity o")
    Integer sumTotalAmount();
}
