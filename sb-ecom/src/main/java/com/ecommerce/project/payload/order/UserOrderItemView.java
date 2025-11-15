package com.ecommerce.project.payload.order;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserOrderItemView {
    Long orderItemId;
    Long productId;
    String productName;
    Integer quantity;
    Double unitPrice;
    Double discount;
    Double lineTotal;
    Boolean reviewSubmitted;
    Boolean canReview;
    Long reviewId;
    Integer reviewRating;
    String reviewTitle;
    String reviewComment;
}

