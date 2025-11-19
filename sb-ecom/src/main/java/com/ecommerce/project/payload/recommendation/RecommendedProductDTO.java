package com.ecommerce.project.payload.recommendation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedProductDTO {
    private Long productId;
    private String productName;
    private Double price;
    private String image;
    private Double score;
}

