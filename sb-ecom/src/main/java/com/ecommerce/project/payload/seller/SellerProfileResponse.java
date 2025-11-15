package com.ecommerce.project.payload.seller;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class SellerProfileResponse {
    Long sellerId;
    String displayName;
    String avatarUrl;
    String headline;
    String description;
    long totalProducts;
    double averageProductPrice;
    List<SellerProductSummary> featuredProducts;
}

