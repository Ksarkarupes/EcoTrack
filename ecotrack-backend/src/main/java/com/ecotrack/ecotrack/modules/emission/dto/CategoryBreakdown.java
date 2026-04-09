package com.ecotrack.ecotrack.modules.emission.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryBreakdown {
    private String category;
    private Double emission;
    private Double percentage;
}
