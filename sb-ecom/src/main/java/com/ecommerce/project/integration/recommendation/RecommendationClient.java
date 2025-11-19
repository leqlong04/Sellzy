package com.ecommerce.project.integration.recommendation;

import java.net.URI;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class RecommendationClient {

    private static final Logger log = LoggerFactory.getLogger(RecommendationClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public RecommendationClient(RestTemplate recommendationRestTemplate,
                                @Value("${recommendation.base-url:http://localhost:8000}") String baseUrl) {
        this.restTemplate = recommendationRestTemplate;
        this.baseUrl = baseUrl;
    }

    public Optional<HybridRecommendationResponse> recommendByItem(String item, int topK) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .path("/recommend/by-item")
                .queryParam("item", item)
                .queryParam("top_k", topK)
                .build()
                .encode()
                .toUri();

        return invoke(uri);
    }

    public Optional<HybridRecommendationResponse> recommendByUser(Long userId, int topK) {
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .path("/recommend/by-user")
                .queryParam("user_id", userId)
                .queryParam("top_k", topK)
                .build()
                .encode()
                .toUri();

        return invoke(uri);
    }

    private Optional<HybridRecommendationResponse> invoke(URI uri) {
        try {
            ResponseEntity<HybridRecommendationResponse> response =
                    restTemplate.getForEntity(uri, HybridRecommendationResponse.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.warn("Recommendation API returned status {}", response.getStatusCode());
                return Optional.empty();
            }

            HybridRecommendationResponse body = response.getBody();
            if (body == null) {
                return Optional.empty();
            }

            if (StringUtils.hasText(body.getError())) {
                log.warn("Recommendation API error: {}", body.getError());
                return Optional.empty();
            }

            return Optional.of(body);
        } catch (RestClientException ex) {
            log.error("Failed to call recommendation API {}", uri, ex);
            return Optional.empty();
        }
    }
}

