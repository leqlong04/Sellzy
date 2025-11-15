package com.ecommerce.project.payload.profile;

import com.ecommerce.project.payload.AddressDTO;
import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class UserProfileResponse {
    Long id;
    String userName;
    String email;
    String phone;
    String avatarUrl;
    List<AddressDTO> addresses;
}

