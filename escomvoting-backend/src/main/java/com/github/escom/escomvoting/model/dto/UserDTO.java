package com.github.escom.escomvoting.model.dto;

import com.github.escom.escomvoting.model.entity.User;

import java.util.UUID;

public record UserDTO(
        UUID id,
        String institutionalId,
        String email,
        String name,
        String role,
        boolean active,
        boolean admin
) {
    public static UserDTO from(User u) {
        return new UserDTO(
                u.getId(),
                u.getInstitutionalId(),
                u.getEmail(),
                u.getName(),
                u.getRole().name(),
                u.isActive(),
                u.isAdmin()
        );
    }
}
