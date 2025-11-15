package com.ecommerce.project.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.ecommerce.project.chat.repository")
public class ChatMongoConfig {
}

