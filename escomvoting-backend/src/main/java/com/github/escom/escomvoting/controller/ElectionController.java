package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.ElectionDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.repository.VoteTokenIssuanceRepository;
import com.github.escom.escomvoting.service.ElectionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionService electionService;
    private final VoteTokenIssuanceRepository issuanceRepository;

    public ElectionController(ElectionService electionService,
                              VoteTokenIssuanceRepository issuanceRepository) {
        this.electionService = electionService;
        this.issuanceRepository = issuanceRepository;
    }

    @GetMapping
    public PageResponse<ElectionDTO> list(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size);
        return PageResponse.from(electionService.listOpenForRole(user.getRole().name(), pageable));
    }

    @GetMapping("/{id}")
    public ElectionDTO get(@PathVariable UUID id) {
        return electionService.getById(id);
    }

    /** Returns the IDs of elections where the authenticated user has already voted. */
    @GetMapping("/my-votes")
    public List<UUID> myVotes(@AuthenticationPrincipal User user) {
        return issuanceRepository.findSignedElectionIdsByUserId(user.getId());
    }
}
