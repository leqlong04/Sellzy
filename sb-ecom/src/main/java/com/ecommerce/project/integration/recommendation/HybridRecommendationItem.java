package com.ecommerce.project.integration.recommendation;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HybridRecommendationItem {
    private String item;
    private Double score;
}

