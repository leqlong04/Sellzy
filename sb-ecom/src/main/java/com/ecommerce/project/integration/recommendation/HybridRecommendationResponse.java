package com.ecommerce.project.integration.recommendation;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HybridRecommendationResponse {
    private String input;
    private String type;
    private String error;
    private List<HybridRecommendationItem> results = new ArrayList<>();
}

