package com.ecotrack.ecotrack.modules.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AlertResponse {

    private Double total;
    private Double limit;
    private Double percentage;
    private String status;
    private String message;
}
