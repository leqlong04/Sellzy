package com.ecommerce.project.chat.repository;

import com.ecommerce.project.chat.document.ChatMessageDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessageDocument, String> {

    List<ChatMessageDocument> findByConversationIdOrderBySentAtDesc(String conversationId, Pageable pageable);

    List<ChatMessageDocument> findByConversationIdAndSentAtBeforeOrderBySentAtDesc(String conversationId, java.time.Instant before, Pageable pageable);
}

