package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.CreateUserRequest;
import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.UserRepository;
import com.github.escom.escomvoting.service.UserImportService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserImportService userImportService;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserRepository userRepository,
                               UserImportService userImportService,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userImportService = userImportService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public PageResponse<UserDTO> listUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "25") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return PageResponse.from(userRepository.findAll(pageable).map(UserDTO::from));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw VotingException.badRequest("El correo ya está registrado");
        }
        if (userRepository.existsByInstitutionalId(req.institutionalId())) {
            throw VotingException.badRequest("El número de boleta/empleado ya está registrado");
        }

        User user = new User();
        user.setInstitutionalId(req.institutionalId());
        user.setEmail(req.email());
        user.setName(req.name());
        user.setRole(UserRole.valueOf(req.role().toUpperCase()));
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setAdmin(req.admin());

        return ResponseEntity.status(HttpStatus.CREATED).body(UserDTO.from(userRepository.save(user)));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importUsers(@RequestParam("file") MultipartFile file) {
        int count = userImportService.importFromCsv(file);
        return ResponseEntity.ok(Map.of("imported", count));
    }
}
