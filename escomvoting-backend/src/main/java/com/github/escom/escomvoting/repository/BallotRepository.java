package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.Ballot;
import com.github.escom.escomvoting.model.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BallotRepository extends JpaRepository<Ballot, UUID> {
    boolean existsByNullifier(String nullifier);

    List<Ballot> findAllByElectionId(UUID electionId);

    Page<Ballot> findAllByElectionId(UUID electionId, Pageable pageable);
    Page<Ballot> findAllByElectionIdAndCandidateId(UUID electionId, UUID candidateId, Pageable pageable);
    Page<Ballot> findAllByElectionIdAndVoterGroup(UUID electionId, UserRole voterGroup, Pageable pageable);
    Page<Ballot> findAllByElectionIdAndCandidateIdAndVoterGroup(UUID electionId, UUID candidateId, UserRole voterGroup, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Ballot b WHERE b.election.id = :electionId AND b.voterGroup = :group")
    long countByElectionIdAndGroup(@Param("electionId") UUID electionId, @Param("group") UserRole group);

    @Query("SELECT COUNT(b) FROM Ballot b WHERE b.election.id = :electionId AND b.candidate.id = :candidateId AND b.voterGroup = :group")
    long countByElectionIdAndCandidateIdAndGroup(
            @Param("electionId") UUID electionId,
            @Param("candidateId") UUID candidateId,
            @Param("group") UserRole group
    );
}
