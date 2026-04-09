package com.ecotrack.ecotrack.modules.emission.model;
import com.ecotrack.ecotrack.modules.emission.domain.RecordType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "records")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmissionRecord {

    @Id
    private UUID id;

    private UUID userId;

    @Enumerated(EnumType.STRING)
    private RecordType type;

    private String activity;

    private Double value;
    private String unit;

    private Double carbonEmission;

    private LocalDateTime createdAt;
}
