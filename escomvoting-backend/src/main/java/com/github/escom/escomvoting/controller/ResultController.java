package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.ElectionResultDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.entity.ElectionStatus;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.BallotRepository;
import com.github.escom.escomvoting.repository.ElectionResultRepository;
import com.github.escom.escomvoting.service.ElectionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/elections/{electionId}")
public class ResultController {

    private final ElectionResultRepository resultRepository;
    private final ElectionService electionService;
    private final BallotRepository ballotRepository;

    public ResultController(ElectionResultRepository resultRepository,
                            ElectionService electionService,
                            BallotRepository ballotRepository) {
        this.resultRepository = resultRepository;
        this.electionService = electionService;
        this.ballotRepository = ballotRepository;
    }

    @GetMapping("/winners")
    public List<ElectionResultDTO> winners(@PathVariable UUID electionId) {
        var election = electionService.findOrThrow(electionId);
        if (election.getStatus() != ElectionStatus.TALLIED) {
            throw VotingException.badRequest("Results are not yet available");
        }

        return resultRepository.findTopScorersByElectionId(electionId).stream()
                .map(r -> {
                    UUID candidateId = r.getCandidate().getId();
                    long studentVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                            electionId, candidateId, UserRole.STUDENT);
                    long professorVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                            electionId, candidateId, UserRole.PROFESSOR);
                    long paaeVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                            electionId, candidateId, UserRole.PAAE);
                    return ElectionResultDTO.from(r, studentVotes, professorVotes, paaeVotes);
                })
                .toList();
    }

    @GetMapping("/results")
    public PageResponse<ElectionResultDTO> results(
            @PathVariable UUID electionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var election = electionService.findOrThrow(electionId);
        if (election.getStatus() != ElectionStatus.TALLIED) {
            throw VotingException.badRequest("Results are not yet available");
        }

        var pageable = PageRequest.of(page, size);
        return PageResponse.from(
                resultRepository.findAllByElectionIdOrderByWeightedScoreDesc(electionId, pageable)
                        .map(r -> {
                            UUID candidateId = r.getCandidate().getId();
                            long studentVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                                    electionId, candidateId, UserRole.STUDENT);
                            long professorVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                                    electionId, candidateId, UserRole.PROFESSOR);
                            long paaeVotes = ballotRepository.countByElectionIdAndCandidateIdAndGroup(
                                    electionId, candidateId, UserRole.PAAE);
                            return ElectionResultDTO.from(r, studentVotes, professorVotes, paaeVotes);
                        })
        );
    }
}
