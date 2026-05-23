package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.UpdateProfileRequest;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserDTO getProfile(@AuthenticationPrincipal User user) {
        return UserDTO.from(user);
    }

    @PutMapping
    public UserDTO updateProfile(@AuthenticationPrincipal User user, @RequestBody UpdateProfileRequest req) {
        return userService.updateProfile(user, req);
    }
}
