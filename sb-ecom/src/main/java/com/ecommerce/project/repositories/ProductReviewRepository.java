package com.ecommerce.project.repositories;

import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.ProductReview;
import com.ecommerce.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Optional<ProductReview> findByOrderItem(OrderItem orderItem);

    Optional<ProductReview> findByUserAndProductProductId(User user, Long productId);

    Page<ProductReview> findByProductProductId(Long productId, Pageable pageable);
}

