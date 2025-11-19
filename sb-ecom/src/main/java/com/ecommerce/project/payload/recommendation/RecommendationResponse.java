package com.ecommerce.project.payload.recommendation;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private String strategy;
    private String input;
    private boolean fallback;
    private List<RecommendedProductDTO> recommendations;
}

