package com.ecommerce.project.chat.dto;

import lombok.Data;

@Data
public class CreateConversationRequest {

    /**
     * Seller identifier to start the conversation with (for customer side).
     */
    private Long sellerId;

    /**
     * Customer identifier to start the conversation with (for seller side).
     */
    private Long userId;

    public void validate() {
        if (sellerId == null && userId == null) {
            throw new IllegalArgumentException("Either sellerId or userId must be provided");
        }
        if (sellerId != null && userId != null) {
            throw new IllegalArgumentException("sellerId and userId cannot be provided together");
        }
    }
}

