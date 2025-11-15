package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.review.CreateProductReviewRequest;
import com.ecommerce.project.payload.review.ProductReviewResponse;
import com.ecommerce.project.repositories.OrderItemRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ProductReviewRepository;
import com.ecommerce.project.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductReviewServiceImpl implements ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final AuthUtil authUtil;

    @Override
    @Transactional
    public ProductReviewResponse createReview(CreateProductReviewRequest request) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new APIException("Rating must be between 1 and 5");
        }

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("OrderItem", "orderItemId", request.getOrderItemId()));

        Order order = orderItem.getOrder();
        if (!"DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new APIException("Only delivered orders can be reviewed");
        }

        User currentUser = authUtil.loggedInUser();
        if (!order.getEmail().equalsIgnoreCase(currentUser.getEmail())) {
            throw new APIException("You are not authorized to review this order");
        }

        productReviewRepository.findByOrderItem(orderItem)
                .ifPresent(review -> {
                    throw new APIException("This item has already been reviewed");
                });

        Product product = orderItem.getProduct();
        ProductReview review = new ProductReview();
        review.setOrder(order);
        review.setOrderItem(orderItem);
        review.setProduct(product);
        review.setUser(currentUser);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setVerified(Boolean.TRUE);

        ProductReview savedReview = productReviewRepository.save(review);

        updateProductAggregateRating(product);

        return mapToResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductReviewResponse> getReviewsForProduct(Long productId, Pageable pageable) {
        return productReviewRepository.findByProductProductId(productId, pageable)
                .map(this::mapToResponse);
    }

    private ProductReviewResponse mapToResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .reviewId(review.getReviewId())
                .rating(review.getRating())
                .title(review.getTitle())
                .comment(review.getComment())
                .reviewerName(review.getUser() != null ? review.getUser().getUserName() : "Anonymous")
                .verified(Boolean.TRUE.equals(review.getVerified()))
                .createdAt(review.getCreatedAt())
                .build();
    }

    private void updateProductAggregateRating(Product product) {
        var stats = productReviewRepository.findByProductProductId(product.getProductId(), Pageable.unpaged())
                .stream()
                .collect(java.util.stream.Collectors.summarizingDouble(ProductReview::getRating));

        product.setRatingCount((int) stats.getCount());
        product.setAverageRating(stats.getCount() == 0 ? 0.0 : stats.getAverage());
        productRepository.save(product);
    }
}

