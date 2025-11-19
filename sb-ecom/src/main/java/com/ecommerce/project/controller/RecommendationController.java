package com.ecommerce.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.project.payload.recommendation.RecommendationResponse;
import com.ecommerce.project.service.RecommendationService;
import com.ecommerce.project.util.AuthUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final AuthUtil authUtil;

    @GetMapping("/public/recommendations/products/{productId}")
    public ResponseEntity<RecommendationResponse> recommendForProduct(
            @PathVariable Long productId,
            @RequestParam(name = "top", required = false) Integer top) {
        RecommendationResponse response = recommendationService.recommendByProduct(productId, top);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/recommendations")
    public ResponseEntity<RecommendationResponse> recommendForCurrentUser(
            @RequestParam(name = "top", required = false) Integer top) {
        Long userId = authUtil.loggedInUserId();
        RecommendationResponse response = recommendationService.recommendForUser(userId, top);
        return ResponseEntity.ok(response);
    }
}

