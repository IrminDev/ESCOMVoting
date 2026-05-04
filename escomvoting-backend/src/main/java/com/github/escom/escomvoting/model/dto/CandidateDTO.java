package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.Candidate;

import java.util.UUID;

public record CandidateDTO(UUID id, String name, String description, int position) {
    public static CandidateDTO from(Candidate c) {
        return new CandidateDTO(c.getId(), c.getName(), c.getDescription(), c.getPosition());
    }
}
