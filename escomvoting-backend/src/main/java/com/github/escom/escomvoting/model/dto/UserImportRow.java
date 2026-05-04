package com.github.escom.escomvoting.model.dto;

// CSV row: institutionalId,email,name,role,password
public record UserImportRow(String institutionalId, String email, String name, String role, String password) {}
