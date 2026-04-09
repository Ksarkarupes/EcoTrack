package com.ecotrack.ecotrack.modules.emission.controller;
import com.ecotrack.ecotrack.config.JwtUtil;
import com.ecotrack.ecotrack.modules.emission.dto.RecordRequest;
import com.ecotrack.ecotrack.modules.emission.dto.RecordResponse;
import com.ecotrack.ecotrack.modules.emission.model.EmissionRecord;
import com.ecotrack.ecotrack.modules.emission.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;
    private final JwtUtil jwtUtil;

    @PostMapping("/enter")
    public void enter(@RequestBody RecordRequest request) {
        UUID userId = jwtUtil.getCurrentUserId();
        recordService.create(userId, request);
    }

    @GetMapping("/gettop")
    public List<EmissionRecord> getTop() {
        UUID userId = jwtUtil.getCurrentUserId();
        return recordService.getTop(userId);
    }

    @PutMapping("/update/{id}")
    public void update(@PathVariable UUID id,
                       @RequestBody RecordRequest request) {

        UUID userId = jwtUtil.getCurrentUserId();
        recordService.update(userId, id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {

        UUID userId = jwtUtil.getCurrentUserId();
        recordService.delete(userId, id);
    }

    @GetMapping("/history")
    public Page<RecordResponse> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        UUID userId = jwtUtil.getCurrentUserId();
        return recordService.getHistory(userId, page, size);
    }
}
