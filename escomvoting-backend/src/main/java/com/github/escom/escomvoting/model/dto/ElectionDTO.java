package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.Election;
import com.github.escom.escomvoting.model.entity.UserRole;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ElectionDTO(
        UUID id,
        String title,
        String description,
        Instant startDate,
        Instant endDate,
        String status,
        List<String> allowedRoles,
        // Per-role public keys — keyed by "STUDENT", "PROFESSOR", "ADMIN"
        // Exposed so the client can pick the correct key for its own role when blinding
        Map<String, String> publicKeys,
        List<CandidateDTO> candidates
) {
    public static ElectionDTO from(Election e) {
        Map<String, String> keys = new HashMap<>();
        for (String roleStr : e.getAllowedRoles()) {
            UserRole role = UserRole.valueOf(roleStr);
            String pub = e.getPublicKeyForRole(role);
            if (pub != null) keys.put(roleStr, pub);
        }
        return new ElectionDTO(
                e.getId(), e.getTitle(), e.getDescription(),
                e.getStartDate(), e.getEndDate(),
                e.getStatus().name(),
                Arrays.asList(e.getAllowedRoles()),
                keys,
                e.getCandidates().stream().map(CandidateDTO::from).toList()
        );
    }
}
