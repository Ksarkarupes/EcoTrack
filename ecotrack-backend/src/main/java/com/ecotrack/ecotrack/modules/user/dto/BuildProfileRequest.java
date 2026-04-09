package com.ecotrack.ecotrack.modules.user.dto;

import lombok.Data;

@Data
public class BuildProfileRequest {

    private String fullName;
    private String profilePicture;
    private Double monthlyCarbonLimit;
}
