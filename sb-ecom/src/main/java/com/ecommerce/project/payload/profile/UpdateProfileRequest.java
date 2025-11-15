package com.ecommerce.project.payload.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String userName;

    @NotBlank
    @Email
    private String email;

    @Pattern(regexp = "^(\\+?[0-9\\- ]{7,20})?$", message = "Invalid phone number format")
    private String phone;
}

