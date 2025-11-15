package com.ecommerce.project.chat.repository;

import com.ecommerce.project.chat.document.ChatConversationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChatConversationRepository extends MongoRepository<ChatConversationDocument, String> {

    Optional<ChatConversationDocument> findByUserIdAndSellerId(Long userId, Long sellerId);

    List<ChatConversationDocument> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<ChatConversationDocument> findBySellerIdOrderByUpdatedAtDesc(Long sellerId);
}

