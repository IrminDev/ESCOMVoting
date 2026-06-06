package com.github.escom.escomvoting.repository;

import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByInstitutionalId(String institutionalId);
    boolean existsByEmail(String email);
    boolean existsByInstitutionalId(String institutionalId);
    List<User> findAllByRole(UserRole role);

    default User findByIdOrThrow(UUID id) {
        return findById(id).orElseThrow(() -> VotingException.notFound("Usuario no encontrado"));
    }
}
