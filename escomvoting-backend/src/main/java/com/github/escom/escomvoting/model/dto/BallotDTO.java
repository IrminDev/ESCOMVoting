package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.Ballot;
import com.github.escom.escomvoting.model.entity.Election;

import java.time.Instant;
import java.util.UUID;

public record BallotDTO(
        UUID id,
        UUID candidateId,
        String candidateName,
        String voterGroup,
        String nullifier,
        String rPrime,
        String sPrime,
        String ePrime,
        String publicKeyForRole,
        Instant submittedAt
) {
    public static BallotDTO from(Ballot b, Election election) {
        String pubKey = election.getPublicKeyForRole(b.getVoterGroup());
        return new BallotDTO(
                b.getId(),
                b.getCandidate().getId(),
                b.getCandidate().getName(),
                b.getVoterGroup().name(),
                b.getNullifier(),
                b.getRPrime(),
                b.getSPrime(),
                b.getEPrime(),
                pubKey,
                b.getSubmittedAt()
        );
    }
}
