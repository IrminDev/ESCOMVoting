package com.github.escom.escomvoting.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.CreateUserRequest;
import com.github.escom.escomvoting.model.dto.UpdateProfileRequest;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.UserRepository;
import com.github.escom.escomvoting.util.PasswordGenerator;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }


    @Transactional
    public UserDTO createUser(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw VotingException.badRequest("El correo ya está registrado");
        }
        if (userRepository.existsByInstitutionalId(req.institutionalId())) {
            throw VotingException.badRequest("El número de boleta/empleado ya está registrado");
        }

        String plainPassword = (req.password() == null || req.password().isBlank())
                ? PasswordGenerator.generate()
                : req.password().trim();

        User user = new User();
        user.setInstitutionalId(req.institutionalId());
        user.setEmail(req.email());
        user.setName(req.name());
        user.setRole(UserRole.valueOf(req.role().toUpperCase()));
        user.setPasswordHash(passwordEncoder.encode(plainPassword));
        user.setAdmin(req.admin());

        User saved = userRepository.save(user);
        emailService.sendWelcomeEmail(saved.getEmail(), saved.getName(), plainPassword);
        return UserDTO.from(saved);
    }

    @Transactional
    public UserDTO updateProfile(User authenticatedUser, UpdateProfileRequest req) {
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> VotingException.notFound("Usuario no encontrado"));

        if (req.newPassword() != null && !req.newPassword().trim().isEmpty()) {
            if (req.currentPassword() == null || req.currentPassword().trim().isEmpty()) {
                throw VotingException.badRequest("Debe proporcionar la contraseña actual");
            }
            if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
                throw VotingException.badRequest("La contraseña actual es incorrecta");
            }
            user.setPasswordHash(passwordEncoder.encode(req.newPassword().trim()));
        }

        return UserDTO.from(userRepository.save(user));
    }
}
