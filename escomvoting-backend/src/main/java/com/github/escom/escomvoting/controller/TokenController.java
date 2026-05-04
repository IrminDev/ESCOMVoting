package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.TokenRequestResponse;
import com.github.escom.escomvoting.model.dto.TokenSignRequest;
import com.github.escom.escomvoting.model.dto.TokenSignResponse;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.service.VoteTokenService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/elections/{electionId}")
public class TokenController {

    private final VoteTokenService voteTokenService;

    public TokenController(VoteTokenService voteTokenService) {
        this.voteTokenService = voteTokenService;
    }

    @PostMapping("/token/request")
    public TokenRequestResponse request(@PathVariable UUID electionId,
                                        @AuthenticationPrincipal User user) {
        return voteTokenService.requestToken(electionId, user);
    }

    @PostMapping("/token/sign")
    public TokenSignResponse sign(@PathVariable UUID electionId,
                                  @AuthenticationPrincipal User user,
                                  @RequestBody TokenSignRequest body) {
        System.out.println("Received sign request for election " + electionId + " c=" + body.blindedChallenge());
        return voteTokenService.signToken(electionId, user, body.blindedChallenge());
    }
}
