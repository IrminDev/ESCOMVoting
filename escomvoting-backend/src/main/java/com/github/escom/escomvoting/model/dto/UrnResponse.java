package com.github.escom.escomvoting.model.dto;

import java.util.List;
import java.util.UUID;

public record UrnResponse(
        UUID electionId,
        String electionTitle,
        List<CandidateDTO> candidates,
        PageResponse<BallotDTO> ballots
) {}
