package com.ecommerce.project.payload;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProductDetailResponse {
    Long productId;
    String productName;
    String image;
    String description;
    Integer quantity;
    double price;
    double discount;
    double specialPrice;
    Long categoryId;
    String categoryName;
    Double averageRating;
    Integer ratingCount;
    Integer unitsSold;
    Long sellerId;
    String sellerName;
    String sellerEmail;
    String sellerAvatarUrl;
    String sellerHeadline;
}

