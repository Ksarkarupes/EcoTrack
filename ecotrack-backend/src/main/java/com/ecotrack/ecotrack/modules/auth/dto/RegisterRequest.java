package com.ecotrack.ecotrack.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @Email
    private String email;

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
