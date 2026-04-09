package com.ecotrack.ecotrack.modules.analytics.controller;

import com.ecotrack.ecotrack.config.JwtUtil;
import com.ecotrack.ecotrack.modules.analytics.dto.AlertResponse;
import com.ecotrack.ecotrack.modules.analytics.dto.SummaryResponse;
import com.ecotrack.ecotrack.modules.analytics.dto.TrendPoint;
import com.ecotrack.ecotrack.modules.analytics.service.AnalyticsService;
import com.ecotrack.ecotrack.modules.emission.dto.CategoryBreakdown;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final JwtUtil jwtUtil;

    @GetMapping("/summary")
    public SummaryResponse summary() {

        UUID userId = jwtUtil.getCurrentUserId();
        return analyticsService.getMonthlySummary(userId);
    }

    @GetMapping("/insights")
    public String insights() {

        UUID userId = jwtUtil.getCurrentUserId();
        return analyticsService.getInsights(userId);
    }
    @GetMapping("/breakdown")
    public List<CategoryBreakdown> breakdown() {
        UUID userId = jwtUtil.getCurrentUserId();
        return analyticsService.getBreakdown(userId);
    }

    @GetMapping("/trends/weekly")
    public List<TrendPoint> weeklyTrends() {

        UUID userId = jwtUtil.getCurrentUserId();
        return analyticsService.getWeeklyTrends(userId);
    }
    @GetMapping("/alert")
    public AlertResponse alert() {
        UUID userId = jwtUtil.getCurrentUserId();
        return analyticsService.getAlert(userId);
    }
}
