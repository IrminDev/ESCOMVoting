package com.github.escom.escomvoting.model.dto;

public record UpdateUserRequest(
        String institutionalId,
        String email,
        String name,
        String role,
        boolean admin,
        boolean active
) {}
