package com.ecotrack.ecotrack.modules.analytics.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getInsights(String prompt) {

        String url = "http://localhost:11434/api/generate";

        Map<String, Object> body = Map.of(
                "model", "mistral:latest",
                "prompt", prompt,
                "stream", false
        );

        Map response = restTemplate.postForObject(url, body, Map.class);

        assert response != null;
        return (String) response.get("response");
    }
}
