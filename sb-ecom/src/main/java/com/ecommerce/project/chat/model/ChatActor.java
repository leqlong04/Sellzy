package com.ecommerce.project.chat.model;

import com.ecommerce.project.model.AppRole;
import lombok.Builder;
import lombok.Value;

import java.util.Set;

@Value
@Builder
public class ChatActor {
    Long userId;
    String username;
    Set<AppRole> roles;

    public boolean isSeller() {
        return roles != null && roles.contains(AppRole.ROLE_SELLER);
    }

    public boolean isUser() {
        return roles != null && roles.contains(AppRole.ROLE_USER);
    }

    public ChatParticipantType resolveParticipantType() {
        return isSeller() && !isUser() ? ChatParticipantType.SELLER : ChatParticipantType.USER;
    }
}

