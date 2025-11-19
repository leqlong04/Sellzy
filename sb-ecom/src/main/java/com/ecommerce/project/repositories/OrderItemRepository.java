package com.ecommerce.project.repositories;

import com.ecommerce.project.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("select coalesce(sum(oi.quantity), 0) from OrderItem oi where oi.product.productId = :productId")
    Integer sumQuantitySoldByProductId(@Param("productId") Long productId);
}
