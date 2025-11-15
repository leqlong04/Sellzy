package com.ecommerce.project.payload.seller;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class SellerProductsResponse {
    List<SellerProductSummary> items;
    int page;
    int size;
    long totalElements;
    int totalPages;
    boolean last;
}

