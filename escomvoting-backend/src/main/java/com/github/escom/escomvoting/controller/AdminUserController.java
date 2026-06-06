package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.CreateUserRequest;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.dto.UpdateUserRequest;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.repository.UserRepository;
import com.github.escom.escomvoting.service.UserImportService;
import com.github.escom.escomvoting.service.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserImportService userImportService;
    private final UserService userService;

    public AdminUserController(UserRepository userRepository,
                               UserImportService userImportService,
                               UserService userService) {
        this.userRepository = userRepository;
        this.userImportService = userImportService;
        this.userService = userService;
    }

    @GetMapping
    public PageResponse<UserDTO> listUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "25") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return PageResponse.from(userRepository.findAll(pageable).map(UserDTO::from));
    }

    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable UUID id) {
        return userService.getUser(id);
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(req));
    }

    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest req) {
        return userService.updateUser(id, req);
    }

    /** Rotates the user's password and emails the new credentials, invalidating the old one. */
    @PostMapping("/{id}/reset-credentials")
    public UserDTO resetCredentials(@PathVariable UUID id) {
        return userService.resetCredentials(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id,
                                           @AuthenticationPrincipal User admin) {
        userService.deleteUser(id, admin);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importUsers(@RequestParam("file") MultipartFile file) {
        int count = userImportService.importFromCsv(file);
        return ResponseEntity.ok(Map.of("imported", count));
    }
}
