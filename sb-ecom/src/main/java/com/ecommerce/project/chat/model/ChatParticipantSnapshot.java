package com.ecommerce.project.chat.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatParticipantSnapshot {
    private Long participantId;
    private ChatParticipantType participantType;
    private String displayName;
    private String avatarUrl;
}

