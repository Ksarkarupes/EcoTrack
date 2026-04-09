package com.ecotrack.ecotrack.modules.analytics.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ollama.url}")
    private String ollamaUrl;

    @Value("${app.ollama.model}")
    private String ollamaModel;

    public String getInsights(String prompt) {

        Map<String, Object> body = Map.of(
                "model", ollamaModel,
                "prompt", prompt,
                "stream", false
        );

        // Using the injected URL
        Map response = restTemplate.postForObject(ollamaUrl, body, Map.class);

        assert response != null;
        return (String) response.get("response");
    }
}
