package com.ecotrack.ecotrack.modules.auth.controller;

import com.ecotrack.ecotrack.modules.auth.dto.AuthResponse;
import com.ecotrack.ecotrack.modules.auth.dto.LoginRequest;
import com.ecotrack.ecotrack.modules.auth.dto.RefreshRequest;
import com.ecotrack.ecotrack.modules.auth.dto.RegisterRequest;
import com.ecotrack.ecotrack.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody RefreshRequest request) {
        return authService.refresh(request.getRefreshToken());
    }
}