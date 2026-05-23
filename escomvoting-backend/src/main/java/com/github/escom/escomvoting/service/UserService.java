package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.UpdateProfileRequest;
import com.github.escom.escomvoting.model.dto.UserDTO;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDTO updateProfile(User authenticatedUser, UpdateProfileRequest req) {
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> VotingException.notFound("Usuario no encontrado"));

        if (req.name() != null && !req.name().trim().isEmpty()) {
            user.setName(req.name().trim());
        }

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
