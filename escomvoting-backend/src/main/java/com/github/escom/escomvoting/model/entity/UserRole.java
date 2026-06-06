package com.github.escom.escomvoting.model.entity;

import com.github.escom.escomvoting.exception.VotingException;

public enum UserRole {
    STUDENT, PROFESSOR, PAAE;

    public static UserRole fromString(String raw) {
        if (raw == null || raw.isBlank()) throw VotingException.badRequest("El rol no puede estar vacío");
        try {
            return valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw VotingException.badRequest("Rol inválido: " + raw);
        }
    }
}
