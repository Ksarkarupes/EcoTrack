package com.ecotrack.ecotrack.modules.emission.dto;

import com.ecotrack.ecotrack.modules.emission.domain.RecordType;
import lombok.Data;

@Data
public class RecordRequest {

    private RecordType type;
    private String activity;
    private Double value;
    private String unit;
}