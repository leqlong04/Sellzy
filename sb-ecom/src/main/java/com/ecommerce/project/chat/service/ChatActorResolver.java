package com.ecommerce.project.chat.service;

import com.ecommerce.project.chat.model.ChatActor;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import com.ecommerce.project.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChatActorResolver {

    private final AuthUtil authUtil;

    public ChatActor getCurrentActor() {
        User user = authUtil.loggedInUser();
        Set<AppRole> roleSet = user.getRoles()
                .stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toSet());
        return ChatActor.builder()
                .userId(user.getUserId())
                .username(user.getUserName())
                .roles(roleSet)
                .build();
    }
}

