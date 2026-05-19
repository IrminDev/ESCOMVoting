package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.BallotDTO;
import com.github.escom.escomvoting.model.dto.CandidateDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.dto.UrnResponse;
import com.github.escom.escomvoting.model.entity.Election;
import com.github.escom.escomvoting.model.entity.ElectionStatus;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.BallotRepository;
import com.github.escom.escomvoting.service.ElectionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/elections/{electionId}/urn")
public class UrnController {

    private final ElectionService electionService;
    private final BallotRepository ballotRepository;

    public UrnController(ElectionService electionService, BallotRepository ballotRepository) {
        this.electionService = electionService;
        this.ballotRepository = ballotRepository;
    }

    @GetMapping
    public UrnResponse urn(
            @PathVariable UUID electionId,
            @RequestParam(defaultValue = "0")    int page,
            @RequestParam(defaultValue = "20")   int size,
            @RequestParam(defaultValue = "asc")  String sort,
            @RequestParam(required = false)       UUID candidateId,
            @RequestParam(required = false)       String voterGroup) {

        Election election = electionService.findOrThrow(electionId);

        if (election.getStatus() != ElectionStatus.CLOSED
                && election.getStatus() != ElectionStatus.TALLIED) {
            throw VotingException.badRequest("The urn is only available once the election has finished");
        }

        Sort.Direction dir = "desc".equalsIgnoreCase(sort) ? Sort.Direction.DESC : Sort.Direction.ASC;
        var pageable = PageRequest.of(page, size, Sort.by(dir, "submittedAt"));

        UserRole group = null;
        if (voterGroup != null && !voterGroup.isBlank()) {
            try { group = UserRole.valueOf(voterGroup.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }

        Page<BallotDTO> ballotPage;
        if (candidateId != null && group != null) {
            ballotPage = ballotRepository
                    .findAllByElectionIdAndCandidateIdAndVoterGroup(electionId, candidateId, group, pageable)
                    .map(b -> BallotDTO.from(b, election));
        } else if (candidateId != null) {
            ballotPage = ballotRepository
                    .findAllByElectionIdAndCandidateId(electionId, candidateId, pageable)
                    .map(b -> BallotDTO.from(b, election));
        } else if (group != null) {
            ballotPage = ballotRepository
                    .findAllByElectionIdAndVoterGroup(electionId, group, pageable)
                    .map(b -> BallotDTO.from(b, election));
        } else {
            ballotPage = ballotRepository
                    .findAllByElectionId(electionId, pageable)
                    .map(b -> BallotDTO.from(b, election));
        }

        List<CandidateDTO> candidates = election.getCandidates().stream()
                .map(CandidateDTO::from)
                .toList();

        return new UrnResponse(election.getId(), election.getTitle(), election.getStatus().name(), candidates, PageResponse.from(ballotPage));
    }
}
