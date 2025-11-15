package com.ecommerce.project.controller;

import com.ecommerce.project.payload.review.CreateProductReviewRequest;
import com.ecommerce.project.payload.review.ProductReviewResponse;
import com.ecommerce.project.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService productReviewService;

    @PostMapping("/user/reviews")
    public ResponseEntity<ProductReviewResponse> createReview(@Valid @RequestBody CreateProductReviewRequest request) {
        return ResponseEntity.ok(productReviewService.createReview(request));
    }

    @GetMapping("/public/products/{productId}/reviews")
    public ResponseEntity<Page<ProductReviewResponse>> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort sortOrder = "ASC".equalsIgnoreCase(direction)
                ? Sort.by(sort).ascending()
                : Sort.by(sort).descending();
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        return ResponseEntity.ok(productReviewService.getReviewsForProduct(productId, pageable));
    }
}

