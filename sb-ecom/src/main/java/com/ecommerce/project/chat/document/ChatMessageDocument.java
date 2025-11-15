package com.ecommerce.project.chat.document;

import com.ecommerce.project.chat.model.ChatMessageAttachment;
import com.ecommerce.project.chat.model.ChatParticipantType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_messages")
public class ChatMessageDocument {

    @Id
    private String id;

    @Field("conversation_id")
    private String conversationId;

    @Field("sender_id")
    private Long senderId;

    @Field("sender_type")
    private ChatParticipantType senderType;

    @Field("content")
    private String content;

    @Field("attachments")
    @Builder.Default
    private List<ChatMessageAttachment> attachments = new ArrayList<>();

    @CreatedDate
    @Field("sent_at")
    private Instant sentAt;

    @Field("delivered_at")
    private Instant deliveredAt;

    @Field("read_by")
    @Builder.Default
    private Map<ChatParticipantType, Instant> readBy = new EnumMap<>(ChatParticipantType.class);
}

