package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.LoginRequest;
import com.github.escom.escomvoting.model.dto.LoginResponse;
import com.github.escom.escomvoting.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
