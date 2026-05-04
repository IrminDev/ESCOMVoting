package com.github.escom.escomvoting.controller;

import com.github.escom.escomvoting.model.dto.PageResponse;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.repository.UserRepository;
import com.github.escom.escomvoting.service.UserImportService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final UserImportService userImportService;

    public AdminUserController(UserRepository userRepository, UserImportService userImportService) {
        this.userRepository = userRepository;
        this.userImportService = userImportService;
    }

    @GetMapping
    public PageResponse<UserDTO> listUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "25") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return PageResponse.from(userRepository.findAll(pageable).map(UserDTO::from));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importUsers(@RequestParam("file") MultipartFile file) {
        int count = userImportService.importFromCsv(file);
        return ResponseEntity.ok(Map.of("imported", count));
    }
}
