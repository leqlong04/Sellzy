package com.ecommerce.project.service;

import com.ecommerce.project.payload.profile.AvatarUploadResponse;
import com.ecommerce.project.payload.profile.UpdateProfileRequest;
import com.ecommerce.project.payload.profile.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProfileService {
    UserProfileResponse getCurrentUserProfile();

    UserProfileResponse updateProfile(UpdateProfileRequest request);

    AvatarUploadResponse updateAvatar(MultipartFile file) throws IOException;
}

