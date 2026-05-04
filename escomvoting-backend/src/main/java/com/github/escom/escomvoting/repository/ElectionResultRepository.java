package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.ElectionResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ElectionResultRepository extends JpaRepository<ElectionResult, UUID> {
    Page<ElectionResult> findAllByElectionIdOrderByWeightedScoreDesc(UUID electionId, Pageable pageable);
    void deleteAllByElectionId(UUID electionId);
}
