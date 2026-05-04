package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.BallotSubmission;
import com.github.escom.escomvoting.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/elections/{electionId}")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    // No @AuthenticationPrincipal — this endpoint is intentionally anonymous
    @PostMapping("/vote")
    @ResponseStatus(HttpStatus.CREATED)
    public void vote(@PathVariable UUID electionId,
                     @RequestBody BallotSubmission submission,
                     HttpServletRequest httpRequest) {
        voteService.submitBallot(electionId, submission);
    }
}
