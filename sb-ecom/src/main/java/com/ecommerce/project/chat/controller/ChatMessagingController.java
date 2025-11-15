package com.ecommerce.project.chat.controller;

import com.ecommerce.project.chat.document.ChatConversationDocument;
import com.ecommerce.project.chat.dto.ChatConversationSummary;
import com.ecommerce.project.chat.dto.ChatMessageView;
import com.ecommerce.project.chat.dto.SendMessageRequest;
import com.ecommerce.project.chat.model.ChatActor;
import com.ecommerce.project.chat.security.ChatPrincipal;
import com.ecommerce.project.chat.service.ChatConversationService;
import com.ecommerce.project.chat.service.ChatMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.security.Principal;
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatMessagingController {

    private final ChatMessageService chatMessageService;
    private final ChatConversationService chatConversationService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/send")
    public void handleSendMessage(@Valid SendMessageRequest request, Principal principal) {
        ChatActor actor = resolveActor(principal);

        ChatMessageView message = chatMessageService.sendMessage(actor, request.getConversationId(), request.getContent());
        ChatConversationDocument conversation = chatConversationService.findById(request.getConversationId());
        ChatConversationSummary summary = chatConversationService.toSummary(conversation);

        String userDestination = String.valueOf(conversation.getUserId());
        String sellerDestination = String.valueOf(conversation.getSellerId());

        messagingTemplate.convertAndSendToUser(userDestination, "/queue/chat/messages", message);
        messagingTemplate.convertAndSendToUser(sellerDestination, "/queue/chat/messages", message);

        messagingTemplate.convertAndSendToUser(userDestination, "/queue/chat/conversations", summary);
        messagingTemplate.convertAndSendToUser(sellerDestination, "/queue/chat/conversations", summary);
    }

    @MessageExceptionHandler
    public void handleException(Throwable throwable, Principal principal) {
        log.error("Chat messaging error for user {}: {}", principal != null ? principal.getName() : "anonymous", throwable.getMessage(), throwable);
    }

    private ChatActor resolveActor(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken authentication &&
                authentication.getPrincipal() instanceof ChatPrincipal chatPrincipal) {
            return ChatActor.builder()
                    .userId(chatPrincipal.getUserId())
                    .username(chatPrincipal.getUsername())
                    .roles(chatPrincipal.getRoles())
                    .build();
        }
        throw new IllegalArgumentException("Unable to resolve chat actor");
    }
}

