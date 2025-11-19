package com.ecommerce.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate recommendationRestTemplate(
            RestTemplateBuilder builder,
            @Value("${recommendation.connect-timeout-ms:2000}") long connectTimeout,
            @Value("${recommendation.read-timeout-ms:3000}") long readTimeout) {

        return builder
                .requestFactory(() -> {
                    HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
                    factory.setConnectTimeout((int) connectTimeout);
                    factory.setReadTimeout((int) readTimeout);
                    return factory;
                })
                .build();
    }
}

