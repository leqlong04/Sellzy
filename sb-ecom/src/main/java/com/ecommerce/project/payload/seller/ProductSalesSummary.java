package com.ecommerce.project.payload.seller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSalesSummary {
    private Long productId;
    private String productName;
    private Long quantitySold;
    private Double revenue; // Revenue before tax
    private Double taxAmount; // Tax paid for this product
    private Double revenueAfterTax; // Revenue after tax
}

