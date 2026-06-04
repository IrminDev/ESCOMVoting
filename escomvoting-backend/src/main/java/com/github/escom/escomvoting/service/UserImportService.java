package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.UserRepository;
import com.github.escom.escomvoting.util.PasswordGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class UserImportService {

    /** Expected CSV header (case-insensitive match on the first row is not performed —
     *  the first row is unconditionally skipped — but operators should follow this layout). */
    public static final String EXPECTED_HEADER = "institutionalId,email,name,role,password,isAdmin";

    private static final Set<String> TRUTHY = Set.of("true", "1", "yes", "y", "si", "sí", "s");
    private static final Set<String> FALSY  = Set.of("false", "0", "no", "n", "");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserImportService(UserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    /** A user pending persistence together with the plaintext password to email them. */
    private record PendingUser(User user, String plainPassword) {}

    @Transactional
    public int importFromCsv(MultipartFile file) {
        List<PendingUser> pending = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            int lineNum = 0;
            while ((line = reader.readLine()) != null) {
                lineNum++;
                if (firstLine) { firstLine = false; continue; } // skip header
                if (line.isBlank()) continue;

                String[] cols = line.split(",", -1);
                if (cols.length < 6) {
                    throw VotingException.badRequest("Line " + lineNum
                            + ": expected 6 columns (" + EXPECTED_HEADER + ")");
                }
                String institutionalId = cols[0].trim();
                String email           = cols[1].trim();
                String name            = cols[2].trim();
                String role            = cols[3].trim().toUpperCase();
                String password        = cols[4].trim();
                boolean isAdmin        = parseAdminFlag(cols[5].trim(), lineNum);

                if (userRepository.existsByEmail(email) || userRepository.existsByInstitutionalId(institutionalId)) {
                    continue; // skip duplicates silently
                }

                // Blank password column → generate a random temporary one to email the user
                String plainPassword = password.isBlank() ? PasswordGenerator.generate() : password;

                User user = new User();
                user.setInstitutionalId(institutionalId);
                user.setEmail(email);
                user.setName(name);
                user.setRole(UserRole.valueOf(role));
                user.setPasswordHash(passwordEncoder.encode(plainPassword));
                user.setAdmin(isAdmin);
                pending.add(new PendingUser(user, plainPassword));
            }
        } catch (VotingException e) {
            throw e;
        } catch (Exception e) {
            throw VotingException.badRequest("Failed to parse CSV: " + e.getMessage());
        }

        userRepository.saveAll(pending.stream().map(PendingUser::user).toList());

        // Send welcome emails after persistence; each send is async and never throws.
        for (PendingUser p : pending) {
            emailService.sendWelcomeEmail(p.user().getEmail(), p.user().getName(), p.plainPassword());
        }
        return pending.size();
    }

    private static boolean parseAdminFlag(String raw, int lineNum) {
        String v = raw.toLowerCase();
        if (TRUTHY.contains(v)) return true;
        if (FALSY.contains(v))  return false;
        throw VotingException.badRequest("Line " + lineNum
                + ": isAdmin must be true/false (got \"" + raw + "\")");
    }
}
