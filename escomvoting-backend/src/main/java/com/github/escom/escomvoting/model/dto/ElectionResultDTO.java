package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.ElectionResult;

import java.math.BigDecimal;
import java.util.UUID;

public record ElectionResultDTO(
        UUID candidateId,
        String candidateName,
        int voteCount,
        BigDecimal weightedScore,
        long studentVotes,
        long professorVotes,
        long paaeVotes
) {
    public static ElectionResultDTO from(ElectionResult r, long studentVotes, long professorVotes, long paaeVotes) {
        return new ElectionResultDTO(
                r.getCandidate().getId(),
                r.getCandidate().getName(),
                r.getVoteCount(),
                r.getWeightedScore(),
                studentVotes,
                professorVotes,
                paaeVotes
        );
    }
}
