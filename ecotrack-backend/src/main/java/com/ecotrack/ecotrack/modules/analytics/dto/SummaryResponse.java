package com.ecotrack.ecotrack.modules.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SummaryResponse {
    private Double totalEmission;
    private Double monthlyLimit;
    private Boolean exceeded;
}
