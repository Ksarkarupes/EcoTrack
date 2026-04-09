package com.ecotrack.ecotrack.modules.user.service;

import com.ecotrack.ecotrack.modules.user.dto.BuildProfileRequest;
import com.ecotrack.ecotrack.modules.user.model.User;
import com.ecotrack.ecotrack.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void buildProfile(UUID userId, BuildProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setProfilePicture(request.getProfilePicture());
        user.setMonthlyCarbonLimit(request.getMonthlyCarbonLimit());

        userRepository.save(user);
    }

}
