package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.ElectionResultDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.entity.ElectionStatus;
import com.github.escom.escomvoting.repository.ElectionResultRepository;
import com.github.escom.escomvoting.service.ElectionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/elections/{electionId}")
public class ResultController {

    private final ElectionResultRepository resultRepository;
    private final ElectionService electionService;

    public ResultController(ElectionResultRepository resultRepository,
                            ElectionService electionService) {
        this.resultRepository = resultRepository;
        this.electionService = electionService;
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
                        .map(ElectionResultDTO::from)
        );
    }
}
