package com.ecotrack.ecotrack.modules.emission.service;

import com.ecotrack.ecotrack.modules.emission.constants.EmissionFactors;
import org.springframework.stereotype.Service;

@Service
public class EmissionService {

    public double calculate(String activity, double value) {

        Double factor = EmissionFactors.FACTORS.get(activity);

        if (factor == null) {
            throw new RuntimeException("Unknown activity: " + activity);
        }

        return factor * value;
    }
}
