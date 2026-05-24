package com.github.escom.escomvoting.model.dto;

public record UpdateProfileRequest(
        String currentPassword,
        String newPassword
) {}
