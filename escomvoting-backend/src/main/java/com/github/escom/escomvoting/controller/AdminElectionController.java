package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.CreateElectionRequest;
import com.github.escom.escomvoting.model.dto.ElectionDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.service.ElectionService;
import com.github.escom.escomvoting.service.TallyService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/elections")
public class AdminElectionController {

    private final ElectionService electionService;
    private final TallyService tallyService;

    public AdminElectionController(ElectionService electionService, TallyService tallyService) {
        this.electionService = electionService;
        this.tallyService = tallyService;
    }

    @GetMapping
    public PageResponse<ElectionDTO> listAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return PageResponse.from(electionService.listAll(pageable));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ElectionDTO create(@RequestBody CreateElectionRequest req,
                              @AuthenticationPrincipal User admin) {
        return electionService.create(req, admin);
    }

    @PutMapping("/{id}")
    public ElectionDTO update(@PathVariable UUID id, @RequestBody CreateElectionRequest req) {
        return electionService.update(id, req);
    }

    @PutMapping("/{id}/status")
    public ElectionDTO updateStatus(@PathVariable UUID id,
                                    @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        ElectionDTO dto = electionService.updateStatus(id, newStatus);
        // Auto-tally when transitioning to TALLIED
        if ("TALLIED".equalsIgnoreCase(newStatus)) {
            tallyService.tally(id);
        }
        return dto;
    }
}
