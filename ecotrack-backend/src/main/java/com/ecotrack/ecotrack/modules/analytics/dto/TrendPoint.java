package com.ecotrack.ecotrack.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TrendPoint {
    private String date;
    private Double emission;
}
