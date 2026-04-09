package com.ecotrack.ecotrack.modules.emission.constants;

import java.util.Map;

public class EmissionFactors {

    public static final Map<String, Double> FACTORS = Map.of(
            // Transport (kg CO2 per km)
            "car", 0.21,
            "bike", 0.09,
            "bus", 0.10,

            // Energy
            "electricity", 0.82,
            "lpg", 2.98,

            // Diet
            "chicken_meal", 2.5,
            "veg_meal", 0.5,
            "red_meat_meal", 7.0,

            // Waste
            "plastic", 6.0,
            "organic", 1.0
    );
}
