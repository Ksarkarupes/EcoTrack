package com.ecotrack.ecotrack.modules.emission.repository;
import com.ecotrack.ecotrack.modules.emission.model.EmissionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface RecordRepository extends JpaRepository<EmissionRecord, UUID> {

    List<EmissionRecord> findTop5ByUserIdOrderByCreatedAtDesc(UUID userId);
    @Query("""
    SELECT SUM(r.carbonEmission)
    FROM EmissionRecord r
    WHERE r.userId = :userId
    AND EXTRACT(MONTH FROM r.createdAt) = :month
    AND EXTRACT(YEAR FROM r.createdAt) = :year
""")
    Double getMonthlyTotal(UUID userId, int month, int year);

    @Query("""
    SELECT r.type, SUM(r.carbonEmission)
    FROM EmissionRecord r
    WHERE r.userId = :userId
    AND EXTRACT(MONTH FROM r.createdAt) = :month
    AND EXTRACT(YEAR FROM r.createdAt) = :year
    GROUP BY r.type
""")
    List<Object[]> getCategoryBreakdown(UUID userId, int month, int year);

    @Query("""
    SELECT DATE(r.createdAt), SUM(r.carbonEmission)
    FROM EmissionRecord r
    WHERE r.userId = :userId
    AND r.createdAt >= :startDate
    GROUP BY DATE(r.createdAt)
    ORDER BY DATE(r.createdAt)
""")
    List<Object[]> getDailyEmissions(UUID userId, LocalDateTime startDate);

    Page<EmissionRecord> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}