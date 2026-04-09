package com.ecotrack.ecotrack.modules.analytics.service;
import com.ecotrack.ecotrack.modules.analytics.dto.AlertResponse;
import com.ecotrack.ecotrack.modules.analytics.dto.SummaryResponse;
import com.ecotrack.ecotrack.modules.analytics.dto.TrendPoint;
import com.ecotrack.ecotrack.modules.emission.dto.CategoryBreakdown;
import com.ecotrack.ecotrack.modules.emission.repository.RecordRepository;
import com.ecotrack.ecotrack.modules.user.model.User;
import com.ecotrack.ecotrack.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final OllamaService ollamaService;

    public SummaryResponse getMonthlySummary(UUID userId) {

        LocalDate now = LocalDate.now();

        Double total = recordRepository.getMonthlyTotal(
                userId,
                now.getMonthValue(),
                now.getYear()
        );

        if (total == null) total = 0.0;

        User user = userRepository.findById(userId)
                .orElseThrow();

        Double limit = user.getMonthlyCarbonLimit();

        return SummaryResponse.builder()
                .totalEmission(total)
                .monthlyLimit(limit)
                .exceeded(limit != null && total > limit)
                .build();
    }
    public List<CategoryBreakdown> getBreakdown(UUID userId) {

        LocalDate now = LocalDate.now();

        List<Object[]> results = recordRepository.getCategoryBreakdown(
                userId,
                now.getMonthValue(),
                now.getYear()
        );

        double total = results.stream()
                .mapToDouble(r -> (Double) r[1])
                .sum();

        return results.stream()
                .map(r -> new CategoryBreakdown(
                        r[0].toString(),
                        (Double) r[1],
                        ((Double) r[1] / total) * 100
                ))
                .toList();
    }
    public String getInsights(UUID userId) {

        SummaryResponse summary = getMonthlySummary(userId);
        List<CategoryBreakdown> breakdown = getBreakdown(userId);

        // Safety check for empty data
        if (breakdown.isEmpty()) {
            return "Start logging your energy, water, or fuel usage to get AI-powered sustainability insights!";
        }

        String breakdownText = breakdown.stream()
                .map(b -> "%s: %.2f kg (%.1f%%)".formatted(b.getCategory(), b.getEmission(), b.getPercentage()))
                .collect(Collectors.joining("\n"));

        CategoryBreakdown top = breakdown.stream()
                .max(Comparator.comparing(CategoryBreakdown::getEmission))
                .orElseThrow(() -> new RuntimeException("No breakdown found"));

        // Ensure limit isn't null for the prompt
        Double limit = summary.getMonthlyLimit() != null ? summary.getMonthlyLimit() : 0.0;

        String prompt = """
You are an expert sustainability advisor in India.

User data:
- Total CO2: %.2f kg
- Limit: %.2f kg
- Status: %s

Top contributing category:
- %s (%.2f%%)

Category breakdown:
%s

Instructions:
1. The top category is ALREADY IDENTIFIED — DO NOT recompute it
2. Focus suggestions ONLY on this category
3. Avoid generic advice
4. Keep response short

Output:

Main Insight:
- ...

Suggestions:
1. ...
2. ...
3. ...
""".formatted(
                summary.getTotalEmission(),
                limit,
                (limit > 0 && summary.getTotalEmission() > limit) ? "EXCEEDED" : "WITHIN LIMIT",
                top.getCategory(),
                top.getPercentage(),
                breakdownText
        );

        return ollamaService.getInsights(prompt);
    }

    public List<TrendPoint> getWeeklyTrends(UUID userId) {

        LocalDateTime start = LocalDate.now()
                .minusDays(6)
                .atStartOfDay();

        List<Object[]> results = recordRepository.getDailyEmissions(userId, start);

        Map<String, Double> map = new HashMap<>();

        for (Object[] r : results) {
            String date = r[0].toString();
            Double emission = (Double) r[1];
            map.put(date, emission);
        }

        List<TrendPoint> trend = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            String key = d.toString();

            trend.add(new TrendPoint(
                    key,
                    map.getOrDefault(key, 0.0)
            ));
        }

        return trend;
    }

    public AlertResponse getAlert(UUID userId) {
        SummaryResponse summary = getMonthlySummary(userId);

        double total = summary.getTotalEmission();
        // Use a default value (e.g., 0.0 or a high number) if limit is null
        Double limitObj = summary.getMonthlyLimit();
        double limit = (limitObj != null) ? limitObj : 0.0;

        // Handle Division by Zero if limit is 0
        double percentage = (limit > 0) ? (total / limit) * 100 : 0.0;

        String status;
        String message;

        if (limit == 0) {
            status = "INFO";
            message = "Please set a monthly limit to track your progress.";
        } else if (percentage >= 100) {
            status = "EXCEEDED";
            message = "You have exceeded your monthly carbon limit!";
        } else if (percentage >= 80) {
            status = "WARNING";
            message = "You have reached 80% of your monthly limit";
        } else {
            status = "SAFE";
            message = "You are within safe limits";
        }

        return AlertResponse.builder()
                .total(total)
                .limit(limit)
                .percentage(percentage)
                .status(status)
                .message(message)
                .build();
    }
}
