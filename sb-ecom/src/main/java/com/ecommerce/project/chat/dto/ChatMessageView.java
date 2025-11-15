package com.ecommerce.project.chat.dto;

import com.ecommerce.project.chat.model.ChatMessageAttachment;
import com.ecommerce.project.chat.model.ChatParticipantType;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Value
@Builder
public class ChatMessageView {
    String id;
    String conversationId;
    Long senderId;
    ChatParticipantType senderType;
    String content;
    List<ChatMessageAttachment> attachments;
    Instant sentAt;
    Instant deliveredAt;
    Map<ChatParticipantType, Instant> readBy;
}

