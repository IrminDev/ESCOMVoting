package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.ElectionResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ElectionResultRepository extends JpaRepository<ElectionResult, UUID> {
    Page<ElectionResult> findAllByElectionIdOrderByWeightedScoreDesc(UUID electionId, Pageable pageable);
    void deleteAllByElectionId(UUID electionId);

    @Query("SELECT r FROM ElectionResult r WHERE r.election.id = :electionId " +
           "AND r.weightedScore = (SELECT MAX(r2.weightedScore) FROM ElectionResult r2 WHERE r2.election.id = :electionId)")
    List<ElectionResult> findTopScorersByElectionId(@Param("electionId") UUID electionId);
}
