package com.github.escom.escomvoting.config;

import com.github.escom.escomvoting.model.entity.User;
import com.github.escom.escomvoting.model.entity.UserRole;
import com.github.escom.escomvoting.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    public ApplicationRunner ensureAdminUser(UserRepository userRepository,
                                             PasswordEncoder passwordEncoder,
                                             @Value("${app.admin.institutional-id:ADMIN-0001}") String adminInstitutionalId,
                                             @Value("${app.admin.email:admin@escom.ipn.mx}") String adminEmail,
                                             @Value("${app.admin.name:Administrador Sistema}") String adminName,
                                             @Value("${app.admin.password:Admin1234!}") String adminPassword) {
        return args -> {
            if (userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = new User();
            admin.setInstitutionalId(adminInstitutionalId);
            admin.setEmail(adminEmail);
            admin.setName(adminName);
            admin.setRole(UserRole.PAAE);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setActive(true);
            userRepository.save(admin);
        };
    }
}
