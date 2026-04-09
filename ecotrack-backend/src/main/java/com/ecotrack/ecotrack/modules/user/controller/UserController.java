package com.ecotrack.ecotrack.modules.user.controller;

import com.ecotrack.ecotrack.config.JwtUtil;
import com.ecotrack.ecotrack.modules.user.dto.BuildProfileRequest;
import com.ecotrack.ecotrack.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/build")
    public void buildProfile(@RequestBody BuildProfileRequest request) {

        UUID userId = jwtUtil.getCurrentUserId();

        userService.buildProfile(userId, request);
    }
}
