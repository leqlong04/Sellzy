package com.ecommerce.project.chat.document;

import com.ecommerce.project.chat.model.ChatParticipantSnapshot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_conversations")
public class ChatConversationDocument {

    @Id
    private String id;

    @Field("user_id")
    private Long userId;

    @Field("seller_id")
    private Long sellerId;

    @Field("user_snapshot")
    private ChatParticipantSnapshot userSnapshot;

    @Field("seller_snapshot")
    private ChatParticipantSnapshot sellerSnapshot;

    @Field("last_message_snippet")
    private String lastMessageSnippet;

    @Field("last_message_at")
    private Instant lastMessageAt;

    @CreatedDate
    @Field("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private Instant updatedAt;

    @Field("user_unread_count")
    private int userUnreadCount;

    @Field("seller_unread_count")
    private int sellerUnreadCount;
}

