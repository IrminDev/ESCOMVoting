package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.ElectionResult;

import java.math.BigDecimal;
import java.util.UUID;

public record ElectionResultDTO(
        UUID candidateId,
        String candidateName,
        int voteCount,
        BigDecimal weightedScore
) {
    public static ElectionResultDTO from(ElectionResult r) {
        return new ElectionResultDTO(
                r.getCandidate().getId(),
                r.getCandidate().getName(),
                r.getVoteCount(),
                r.getWeightedScore()
        );
    }
}
