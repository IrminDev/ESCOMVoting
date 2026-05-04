package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.ElectionDTO;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.service.ElectionService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/elections")
public class PublicElectionController {

    private final ElectionService electionService;

    public PublicElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @GetMapping
    public PageResponse<ElectionDTO> listFinished(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("endDate").descending());
        return PageResponse.from(electionService.listFinished(pageable));
    }
}
