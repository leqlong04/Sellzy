package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("select COALESCE(sum(o.totalAmount), 0) from Order o")
    Double getTotalRevenue();

   Page<Order> findByUserUserId(Long userId, Pageable pageable);

    java.util.Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);
}
