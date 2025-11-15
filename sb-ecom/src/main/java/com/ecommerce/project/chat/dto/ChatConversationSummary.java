package com.ecommerce.project.chat.dto;

import com.ecommerce.project.chat.model.ChatParticipantSnapshot;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ChatConversationSummary {
    String id;
    ChatParticipantSnapshot user;
    ChatParticipantSnapshot seller;
    String lastMessageSnippet;
    Instant lastMessageAt;
    int userUnreadCount;
    int sellerUnreadCount;
}

