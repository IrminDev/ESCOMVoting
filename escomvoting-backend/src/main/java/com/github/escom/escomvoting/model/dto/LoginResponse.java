package com.github.escom.escomvoting.model.dto;

public record LoginResponse(String token, String role, String name, boolean isAdmin) {}
