package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.VoteTokenIssuance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoteTokenIssuanceRepository extends JpaRepository<VoteTokenIssuance, UUID> {
    Optional<VoteTokenIssuance> findByUserIdAndElectionId(UUID userId, UUID electionId);
    boolean existsByUserIdAndElectionId(UUID userId, UUID electionId);

    @Query("SELECT v.election.id FROM VoteTokenIssuance v WHERE v.user.id = :userId AND v.stage = 'SIGNED'")
    List<UUID> findSignedElectionIdsByUserId(@Param("userId") UUID userId);
}
