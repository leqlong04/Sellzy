package com.ecommerce.project.chat.security;

import com.ecommerce.project.model.AppRole;
import lombok.Getter;

import java.security.Principal;
import java.util.Set;

@Getter
public class ChatPrincipal implements Principal {

    private final Long userId;
    private final String username;
    private final Set<AppRole> roles;

    public ChatPrincipal(Long userId, String username, Set<AppRole> roles) {
        this.userId = userId;
        this.username = username;
        this.roles = roles;
    }

    @Override
    public String getName() {
        return String.valueOf(userId);
    }
}

