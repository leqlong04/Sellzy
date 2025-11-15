package com.ecommerce.project.chat.service;

import com.ecommerce.project.chat.document.ChatConversationDocument;
import com.ecommerce.project.chat.dto.ChatConversationSummary;
import com.ecommerce.project.chat.model.ChatParticipantSnapshot;
import com.ecommerce.project.chat.repository.ChatConversationRepository;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import com.ecommerce.project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatConversationService {

    private final ChatConversationRepository conversationRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatConversationDocument getOrCreateConversation(Long userId, Long sellerId) {
        Optional<ChatConversationDocument> existing = conversationRepository.findByUserIdAndSellerId(userId, sellerId);
        if (existing.isPresent()) {
            return ensureSnapshots(existing.get());
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + sellerId));

        ChatConversationDocument conversation = ChatConversationDocument.builder()
                .userId(userId)
                .sellerId(sellerId)
                .userSnapshot(buildSnapshot(user))
                .sellerSnapshot(buildSnapshot(seller))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .lastMessageSnippet(null)
                .lastMessageAt(null)
                .userUnreadCount(0)
                .sellerUnreadCount(0)
                .build();

        return conversationRepository.save(conversation);
    }

    public List<ChatConversationSummary> getConversationsForUser(Long userId) {
        List<ChatConversationDocument> documents = conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        refreshSnapshots(documents);
        return documents.stream().map(this::toSummary).toList();
    }

    public List<ChatConversationSummary> getConversationsForSeller(Long sellerId) {
        List<ChatConversationDocument> documents = conversationRepository.findBySellerIdOrderByUpdatedAtDesc(sellerId);
        refreshSnapshots(documents);
        return documents.stream().map(this::toSummary).toList();
    }

    public ChatConversationDocument markAsRead(ChatConversationDocument conversation, boolean readerIsSeller) {
        if (readerIsSeller) {
            conversation.setSellerUnreadCount(0);
        } else {
            conversation.setUserUnreadCount(0);
        }
        conversation.setUpdatedAt(Instant.now());
        return conversationRepository.save(conversation);
    }

    public ChatConversationDocument updateLastMessage(ChatConversationDocument conversation,
                                                      String snippet,
                                                      Instant timestamp,
                                                      boolean senderIsSeller) {
        conversation.setLastMessageSnippet(snippet);
        conversation.setLastMessageAt(timestamp);
        conversation.setUpdatedAt(timestamp);

        if (senderIsSeller) {
            conversation.setUserUnreadCount(conversation.getUserUnreadCount() + 1);
        } else {
            conversation.setSellerUnreadCount(conversation.getSellerUnreadCount() + 1);
        }
        return conversationRepository.save(conversation);
    }

    public ChatConversationDocument findById(String conversationId) {
        return conversationRepository.findById(conversationId)
                .map(this::ensureSnapshots)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + conversationId));
    }

    private ChatConversationDocument ensureSnapshots(ChatConversationDocument conversation) {
        boolean changed = false;
        if (conversation.getUserSnapshot() == null) {
            conversation.setUserSnapshot(buildSnapshot(
                    userRepository.findById(conversation.getUserId())
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + conversation.getUserId()))
            ));
            changed = true;
        }
        if (conversation.getSellerSnapshot() == null) {
            conversation.setSellerSnapshot(buildSnapshot(
                    userRepository.findById(conversation.getSellerId())
                            .orElseThrow(() -> new IllegalArgumentException("Seller not found: " + conversation.getSellerId()))
            ));
            changed = true;
        }
        if (changed) {
            return conversationRepository.save(conversation);
        }
        return conversation;
    }

    private void refreshSnapshots(List<ChatConversationDocument> documents) {
        Set<Long> userIds = documents.stream()
                .map(ChatConversationDocument::getUserId)
                .collect(Collectors.toSet());
        Set<Long> sellerIds = documents.stream()
                .map(ChatConversationDocument::getSellerId)
                .collect(Collectors.toSet());
        Set<Long> allIds = new java.util.HashSet<>();
        allIds.addAll(userIds);
        allIds.addAll(sellerIds);
        if (allIds.isEmpty()) {
            return;
        }

        Map<Long, ChatParticipantSnapshot> snapshotMap = userRepository.findAllById(allIds)
                .stream()
                .map(user -> Map.entry(user.getUserId(), buildSnapshot(user)))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        boolean dirty = false;
        for (ChatConversationDocument doc : documents) {
            ChatParticipantSnapshot userSnapshot = snapshotMap.get(doc.getUserId());
            ChatParticipantSnapshot sellerSnapshot = snapshotMap.get(doc.getSellerId());
            if (userSnapshot != null && !userSnapshot.equals(doc.getUserSnapshot())) {
                doc.setUserSnapshot(userSnapshot);
                dirty = true;
            }
            if (sellerSnapshot != null && !sellerSnapshot.equals(doc.getSellerSnapshot())) {
                doc.setSellerSnapshot(sellerSnapshot);
                dirty = true;
            }
        }
        if (dirty) {
            conversationRepository.saveAll(documents);
        }
    }

    public ChatConversationSummary toSummary(ChatConversationDocument document) {
        return ChatConversationSummary.builder()
                .id(document.getId())
                .user(document.getUserSnapshot())
                .seller(document.getSellerSnapshot())
                .lastMessageSnippet(document.getLastMessageSnippet())
                .lastMessageAt(document.getLastMessageAt())
                .userUnreadCount(document.getUserUnreadCount())
                .sellerUnreadCount(document.getSellerUnreadCount())
                .build();
    }

    private ChatParticipantSnapshot buildSnapshot(User user) {
        boolean isSeller = user.getRoles().stream()
                .anyMatch(role -> role.getRoleName() == AppRole.ROLE_SELLER);
        return ChatParticipantSnapshot.builder()
                .participantId(user.getUserId())
                .participantType(isSeller
                        ? com.ecommerce.project.chat.model.ChatParticipantType.SELLER
                        : com.ecommerce.project.chat.model.ChatParticipantType.USER)
                .displayName(user.getUserName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}

