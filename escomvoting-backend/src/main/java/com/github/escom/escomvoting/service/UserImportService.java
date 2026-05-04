package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserImportService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserImportService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public int importFromCsv(MultipartFile file) {
        List<User> toSave = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (firstLine) { firstLine = false; continue; } // skip header
                String[] cols = line.split(",", -1);
                if (cols.length < 5) {
                    throw VotingException.badRequest("Line " + lineNum + ": expected 5 columns (institutionalId,email,name,role,password)");
                }
                String institutionalId = cols[0].trim();
                String email = cols[1].trim();
                String name = cols[2].trim();
                String role = cols[3].trim().toUpperCase();
                String password = cols[4].trim();

                if (userRepository.existsByEmail(email) || userRepository.existsByInstitutionalId(institutionalId)) {
                    continue; // skip duplicates silently
                }

                User user = new User();
                user.setInstitutionalId(institutionalId);
                user.setEmail(email);
                user.setName(name);
                user.setRole(UserRole.valueOf(role));
                user.setPasswordHash(passwordEncoder.encode(password));
                toSave.add(user);
            }
        } catch (VotingException e) {
            throw e;
        } catch (Exception e) {
            throw VotingException.badRequest("Failed to parse CSV: " + e.getMessage());
        }
        userRepository.saveAll(toSave);
        return toSave.size();
    }
}
