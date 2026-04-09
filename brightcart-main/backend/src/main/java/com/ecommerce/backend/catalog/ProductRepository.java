package com.ecommerce.backend.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    long countByStockQuantityLessThanEqual(Integer stockQuantity);

    long countByCategoryId(Long categoryId);
}
