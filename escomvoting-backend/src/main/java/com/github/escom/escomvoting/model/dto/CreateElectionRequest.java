package com.github.escom.escomvoting.model.dto;

import java.time.Instant;
import java.util.List;

public record CreateElectionRequest(
        String title,
        String description,
        Instant startDate,
        Instant endDate,
        List<String> allowedRoles,
        List<CandidateInput> candidates
) {
    public record CandidateInput(String name, String description) {}
}
