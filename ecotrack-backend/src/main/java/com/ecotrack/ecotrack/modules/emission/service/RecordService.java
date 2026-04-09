package com.ecotrack.ecotrack.modules.emission.service;

import com.ecotrack.ecotrack.modules.emission.dto.RecordRequest;
import com.ecotrack.ecotrack.modules.emission.dto.RecordResponse;
import com.ecotrack.ecotrack.modules.emission.model.EmissionRecord;
import com.ecotrack.ecotrack.modules.emission.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final EmissionService emissionService;

    public void create(UUID userId, RecordRequest request) {

        double emission = emissionService.calculate(
                request.getActivity(),
                request.getValue()
        );

        EmissionRecord record = EmissionRecord.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .type(request.getType())
                .activity(request.getActivity())
                .value(request.getValue())
                .unit(request.getUnit())
                .carbonEmission(emission)
                .createdAt(LocalDateTime.now())
                .build();

        recordRepository.save(record);
    }

    public List<EmissionRecord> getTop(UUID userId) {
        return recordRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
    }

    public void update(UUID userId, UUID recordId, RecordRequest request) {

        EmissionRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!record.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        double emission = emissionService.calculate(
                request.getActivity(),
                request.getValue()
        );

        record.setType(request.getType());
        record.setActivity(request.getActivity());
        record.setValue(request.getValue());
        record.setUnit(request.getUnit());
        record.setCarbonEmission(emission);

        recordRepository.save(record);
    }

    public void delete(UUID userId, UUID recordId) {

        EmissionRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!record.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        recordRepository.delete(record);
    }

    public Page<RecordResponse> getHistory(UUID userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<EmissionRecord> records =
                recordRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return records.map(r -> RecordResponse.builder()
                .id(r.getId())
                .type(r.getType().name())
                .activity(r.getActivity())
                .value(r.getValue())
                .unit(r.getUnit())
                .carbonEmission(r.getCarbonEmission())
                .createdAt(r.getCreatedAt())
                .build()
        );
    }
}
