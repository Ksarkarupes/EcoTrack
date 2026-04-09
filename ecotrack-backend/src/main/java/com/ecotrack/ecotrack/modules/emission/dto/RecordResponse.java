package com.ecotrack.ecotrack.modules.emission.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class RecordResponse {

    private UUID id;
    private String type;
    private String activity;
    private Double value;
    private String unit;
    private Double carbonEmission;
    private LocalDateTime createdAt;
}
