package com.github.escom.escomvoting.model.dto;

public record CreateUserRequest(
        String institutionalId,
        String email,
        String name,
        String role,
        String password,
        boolean admin
) {}
