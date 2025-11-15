package com.ecommerce.project.chat.service;

import com.ecommerce.project.chat.document.ChatConversationDocument;
import com.ecommerce.project.chat.document.ChatMessageDocument;
import com.ecommerce.project.chat.dto.ChatMessageView;
import com.ecommerce.project.chat.model.ChatActor;
import com.ecommerce.project.chat.model.ChatParticipantType;
import com.ecommerce.project.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private static final int DEFAULT_PAGE_SIZE = 20;

    private final ChatMessageRepository messageRepository;
    private final ChatConversationService conversationService;

    public ChatMessageView sendMessage(ChatActor sender, String conversationId, String content) {
        ChatConversationDocument conversation = conversationService.findById(conversationId);
        validateSender(sender, conversation);

        ChatParticipantType senderType = resolveSenderType(sender, conversation);

        ChatMessageDocument message = ChatMessageDocument.builder()
                .conversationId(conversationId)
                .senderId(sender.getUserId())
                .senderType(senderType)
                .content(content.trim())
                .sentAt(Instant.now())
                .deliveredAt(Instant.now())
                .build();

        ChatMessageDocument saved = messageRepository.save(message);

        boolean senderIsSeller = senderType == ChatParticipantType.SELLER;
        conversationService.updateLastMessage(conversation,
                createSnippet(content),
                saved.getSentAt(),
                senderIsSeller);

        return toView(saved);
    }

    public List<ChatMessageView> getMessages(String conversationId, int page, int size, Instant before) {
        int resolvedPage = Math.max(page, 0);
        int resolvedSize = size > 0 ? Math.min(size, 100) : DEFAULT_PAGE_SIZE;

        List<ChatMessageDocument> documents;
        if (before != null) {
            documents = messageRepository
                    .findByConversationIdAndSentAtBeforeOrderBySentAtDesc(
                            conversationId,
                            before,
                            PageRequest.of(resolvedPage, resolvedSize));
        } else {
            documents = messageRepository
                    .findByConversationIdOrderBySentAtDesc(
                            conversationId,
                            PageRequest.of(resolvedPage, resolvedSize));
        }

        return documents.stream()
                .map(this::toView)
                .collect(Collectors.toList());
    }

    public ChatConversationDocument markAsRead(ChatActor actor, String conversationId) {
        ChatConversationDocument conversation = conversationService.findById(conversationId);
        boolean readerIsSeller = resolveSenderType(actor, conversation) == ChatParticipantType.SELLER;

        // update message read receipts
        List<ChatMessageDocument> messages = messageRepository
                .findByConversationIdOrderBySentAtDesc(
                        conversationId,
                        PageRequest.of(0, DEFAULT_PAGE_SIZE));

        Instant now = Instant.now();
        for (ChatMessageDocument message : messages) {
            if (message.getReadBy() == null) {
                message.setReadBy(new EnumMap<>(ChatParticipantType.class));
            }
            Map<ChatParticipantType, Instant> readBy = message.getReadBy();
            ChatParticipantType readerType = readerIsSeller
                    ? ChatParticipantType.SELLER
                    : ChatParticipantType.USER;
            readBy.put(readerType, now);
        }
        messageRepository.saveAll(messages);

        return conversationService.markAsRead(conversation, readerIsSeller);
    }

    public ChatMessageView toView(ChatMessageDocument document) {
        return ChatMessageView.builder()
                .id(document.getId())
                .conversationId(document.getConversationId())
                .senderId(document.getSenderId())
                .senderType(document.getSenderType())
                .content(document.getContent())
                .attachments(document.getAttachments())
                .sentAt(document.getSentAt())
                .deliveredAt(document.getDeliveredAt())
                .readBy(document.getReadBy())
                .build();
    }

    private void validateSender(ChatActor sender, ChatConversationDocument conversation) {
        if (sender.getUserId().equals(conversation.getUserId())) {
            return;
        }
        if (sender.getUserId().equals(conversation.getSellerId())) {
            return;
        }
        throw new IllegalArgumentException("Sender does not belong to conversation");
    }

    private ChatParticipantType resolveSenderType(ChatActor sender, ChatConversationDocument conversation) {
        if (sender.getUserId().equals(conversation.getSellerId())) {
            return ChatParticipantType.SELLER;
        }
        return ChatParticipantType.USER;
    }

    private String createSnippet(String content) {
        String normalized = content.strip();
        if (normalized.length() <= 150) {
            return normalized;
        }
        return normalized.substring(0, 147) + "...";
    }
}

