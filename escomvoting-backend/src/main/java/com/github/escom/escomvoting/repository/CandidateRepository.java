package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.model.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    List<Candidate> findAllByElectionIdOrderByPositionAsc(UUID electionId);
}
