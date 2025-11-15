package com.ecommerce.project.service;

import com.ecommerce.project.payload.review.CreateProductReviewRequest;
import com.ecommerce.project.payload.review.ProductReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductReviewService {

    ProductReviewResponse createReview(CreateProductReviewRequest request);

    Page<ProductReviewResponse> getReviewsForProduct(Long productId, Pageable pageable);
}

