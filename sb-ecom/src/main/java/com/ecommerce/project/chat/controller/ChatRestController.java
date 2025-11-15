package com.ecommerce.project.chat.controller;

import com.ecommerce.project.chat.document.ChatConversationDocument;
import com.ecommerce.project.chat.dto.ChatConversationSummary;
import com.ecommerce.project.chat.dto.ChatMessageView;
import com.ecommerce.project.chat.dto.CreateConversationRequest;
import com.ecommerce.project.chat.dto.MarkConversationReadRequest;
import com.ecommerce.project.chat.dto.SendMessageRequest;
import com.ecommerce.project.chat.model.ChatActor;
import com.ecommerce.project.chat.service.ChatActorResolver;
import com.ecommerce.project.chat.service.ChatConversationService;
import com.ecommerce.project.chat.service.ChatMessageService;
import com.ecommerce.project.model.AppRole;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatActorResolver actorResolver;
    private final ChatConversationService conversationService;
    private final ChatMessageService messageService;

    @PostMapping("/conversations")
    public ResponseEntity<ChatConversationSummary> createConversation(
            @Valid @RequestBody CreateConversationRequest request) {
        request.validate();
        ChatActor actor = actorResolver.getCurrentActor();

        Long userId;
        Long sellerId;
        if (request.getSellerId() != null) {
            if (actor.getRoles().contains(AppRole.ROLE_SELLER) && !actor.getRoles().contains(AppRole.ROLE_USER)) {
                return ResponseEntity.status(403).build();
            }
            userId = actor.getUserId();
            sellerId = request.getSellerId();
        } else {
            // seller initiating conversation with customer
            if (!actor.getRoles().contains(AppRole.ROLE_SELLER)) {
                return ResponseEntity.status(403).build();
            }
            userId = request.getUserId();
            sellerId = actor.getUserId();
        }

        ChatConversationDocument conversation = conversationService.getOrCreateConversation(userId, sellerId);
        return ResponseEntity.ok(conversationService.toSummary(conversation));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversationSummary>> listConversations() {
        ChatActor actor = actorResolver.getCurrentActor();
        if (actor.getRoles().contains(AppRole.ROLE_SELLER) && !actor.getRoles().contains(AppRole.ROLE_USER)) {
            return ResponseEntity.ok(conversationService.getConversationsForSeller(actor.getUserId()));
        }
        return ResponseEntity.ok(conversationService.getConversationsForUser(actor.getUserId()));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageView>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "before", required = false) Long beforeEpochMillis) {
        ChatActor actor = actorResolver.getCurrentActor();
        ChatConversationDocument conversation = conversationService.findById(conversationId);
        // ensure actor belongs to conversation
        if (!actor.getUserId().equals(conversation.getUserId()) &&
                !actor.getUserId().equals(conversation.getSellerId())) {
            return ResponseEntity.status(403).build();
        }
        Instant before = beforeEpochMillis != null ? Instant.ofEpochMilli(beforeEpochMillis) : null;
        List<ChatMessageView> messages = messageService.getMessages(conversationId, page, size, before);
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/conversations/{conversationId}/read")
    public ResponseEntity<ChatConversationSummary> markAsRead(
            @PathVariable String conversationId,
            @RequestBody(required = false) MarkConversationReadRequest request) {
        ChatActor actor = actorResolver.getCurrentActor();
        ChatConversationDocument updated = messageService.markAsRead(actor, conversationId);
        return ResponseEntity.ok(conversationService.toSummary(updated));
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatMessageView> sendMessageFallback(
            @Valid @RequestBody SendMessageRequest request) {
        ChatActor actor = actorResolver.getCurrentActor();
        ChatMessageView message = messageService.sendMessage(actor, request.getConversationId(), request.getContent());
        return ResponseEntity.ok(message);
    }
}

