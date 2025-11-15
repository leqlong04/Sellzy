package com.ecommerce.project.payload.seller;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class SellerProductSummary {
    Long productId;
    String productName;
    String image;
    String description;
    double price;
    double specialPrice;
    double discount;
    Integer quantity;
    Double averageRating;
    Integer ratingCount;
}

