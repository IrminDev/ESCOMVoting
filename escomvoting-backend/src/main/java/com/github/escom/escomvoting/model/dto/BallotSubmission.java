package com.github.escom.escomvoting.model.dto;

import java.util.UUID;

public record BallotSubmission(
        UUID candidateId,
        String voterGroup,
        String nullifier,
        String rPrime,
        String sPrime,
        String ePrime
) {}
