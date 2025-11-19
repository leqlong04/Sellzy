package com.ecommerce.project.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.integration.recommendation.HybridRecommendationItem;
import com.ecommerce.project.integration.recommendation.HybridRecommendationResponse;
import com.ecommerce.project.integration.recommendation.RecommendationClient;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.recommendation.RecommendationResponse;
import com.ecommerce.project.payload.recommendation.RecommendedProductDTO;
import com.ecommerce.project.repositories.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ProductRepository productRepository;
    private final RecommendationClient recommendationClient;

    @Value("${recommendation.top-k-default:5}")
    private int defaultTopK;

    @Override
    public RecommendationResponse recommendByProduct(Long productId, Integer topK) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        int limit = normalizeTopK(topK);

        Optional<HybridRecommendationResponse> external =
                recommendationClient.recommendByItem(product.getProductName(), limit);

        return buildResponse(external, product.getProductName(), "item-based");
    }

    @Override
    public RecommendationResponse recommendForUser(Long userId, Integer topK) {
        int limit = normalizeTopK(topK);

        Optional<HybridRecommendationResponse> external =
                recommendationClient.recommendByUser(userId, limit);

        return buildResponse(external, String.valueOf(userId), "user-based");
    }

    private RecommendationResponse buildResponse(Optional<HybridRecommendationResponse> external,
                                                 String input,
                                                 String strategy) {
        List<RecommendedProductDTO> items = external
                .map(HybridRecommendationResponse::getResults)
                .map(this::mapToProducts)
                .orElse(Collections.emptyList());

        boolean fallback = items.isEmpty();

        return RecommendationResponse.builder()
                .strategy(strategy)
                .input(input)
                .fallback(fallback)
                .recommendations(items)
                .build();
    }

    private List<RecommendedProductDTO> mapToProducts(List<HybridRecommendationItem> results) {
        if (results == null) {
            return Collections.emptyList();
        }
        return results.stream()
                .filter(item -> item != null && StringUtils.hasText(item.getItem()))
                .map(this::mapItem)
                .collect(Collectors.toList());
    }

    private RecommendedProductDTO mapItem(HybridRecommendationItem item) {
        return productRepository.findFirstByProductNameIgnoreCase(item.getItem())
                .map(product -> RecommendedProductDTO.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .price(resolvePrice(product))
                        .image(product.getImage())
                        .score(item.getScore())
                        .build())
                .orElse(RecommendedProductDTO.builder()
                        .productId(null)
                        .productName(item.getItem())
                        .price(null)
                        .image(null)
                        .score(item.getScore())
                        .build());
    }

    private double resolvePrice(Product product) {
        if (product.getSpecialPrice() > 0) {
            return product.getSpecialPrice();
        }
        return product.getPrice();
    }

    private int normalizeTopK(Integer topK) {
        if (topK == null || topK <= 0) {
            return defaultTopK;
        }
        return topK;
    }
}

