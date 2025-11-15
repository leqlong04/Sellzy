package com.ecommerce.project.payload.review;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class ProductReviewResponse {
    Long reviewId;
    Integer rating;
    String title;
    String comment;
    String reviewerName;
    boolean verified;
    LocalDateTime createdAt;
}

