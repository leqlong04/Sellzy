package com.ecommerce.project.service;

import com.ecommerce.project.payload.recommendation.RecommendationResponse;

public interface RecommendationService {

    RecommendationResponse recommendByProduct(Long productId, Integer topK);

    RecommendationResponse recommendForUser(Long userId, Integer topK);
}

