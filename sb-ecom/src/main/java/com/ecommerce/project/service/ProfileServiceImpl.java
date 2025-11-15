package com.ecommerce.project.service;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.payload.profile.AvatarUploadResponse;
import com.ecommerce.project.payload.profile.UpdateProfileRequest;
import com.ecommerce.project.payload.profile.UserProfileResponse;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.util.AuthUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;

    @Value("${profile.avatar.path:images/profiles}")
    private String avatarPath;

    @Value("${image.base.url:http://localhost:8080/images}")
    private String imageBaseUrl;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        User user = authUtil.loggedInUser();
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(@Valid UpdateProfileRequest request) {
        User user = authUtil.loggedInUser();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AvatarUploadResponse updateAvatar(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Avatar file is required");
        }
        User user = authUtil.loggedInUser();
        String avatarFileName = fileService.uploadImage(avatarPath, file);
        String relativeFolder = avatarPath.startsWith("images/")
                ? avatarPath.substring("images/".length())
                : avatarPath;
        String relativePath = relativeFolder.endsWith("/")
                ? relativeFolder + avatarFileName
                : relativeFolder + "/" + avatarFileName;
        String publicUrl = imageBaseUrl.endsWith("/")
                ? imageBaseUrl + relativePath
                : imageBaseUrl + "/" + relativePath;
        user.setAvatarUrl(publicUrl);
        userRepository.save(user);
        return new AvatarUploadResponse(publicUrl);
    }

    private UserProfileResponse mapToResponse(User user) {
        List<AddressDTO> addressDTOS = user.getAddresses()
                .stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());

        return UserProfileResponse.builder()
                .id(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .addresses(addressDTOS)
                .build();
    }
}

