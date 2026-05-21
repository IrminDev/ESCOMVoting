package com.github.escom.escomvoting.config;

import com.github.escom.escomvoting.repository.UserRepository;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * HTTP security rules for the ESCOM Voting backend.
 *
 * Authority model:
 *   - ROLE_STUDENT / ROLE_PROFESSOR / ROLE_PAAE     → granted to every authenticated user, matches the user's role enum
 *   - SCOPE_ADMIN                                   → granted by {@link JwtAuthFilter} to PAAE users only;
 *                                                     gates every administrative endpoint
 *
 * Rule ordering goes from most permissive (public) to most restrictive (admin scope),
 * with an authenticated catch-all at the bottom. Method-level @PreAuthorize is enabled
 * via @EnableMethodSecurity for finer-grained checks inside services.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(
        HttpSecurity http,
        JwtAuthFilter jwtAuthFilter
    ) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s ->
                s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth ->
                auth
                    // ── CORS preflight ──────────────────────────────────────────
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll()

                    // ── Anonymous endpoints ─────────────────────────────────────
                    .requestMatchers(HttpMethod.POST, "/api/auth/login")
                    .permitAll()

                    // Anonymous vote submission — by protocol design, the urn must
                    // accept a signed-blinded ballot from a client that already
                    // exchanged its token, without re-presenting an identity.
                    .requestMatchers(HttpMethod.POST, "/api/elections/*/vote")
                    .permitAll()

                    // Public read-only surfaces (results, urn snapshot, archive)
                    .requestMatchers(HttpMethod.GET, "/api/elections/*/results")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/elections/*/winners")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/elections/*/urn")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/public/**")
                    .permitAll()

                    // ── Admin scope (PAAE-only) ─────────────────────────────────
                    // SCOPE_ADMIN is granted by JwtAuthFilter exclusively to users
                    // whose role is PAAE. Locks down every /api/admin/* surface
                    // for all HTTP methods.
                    .requestMatchers("/api/admin/**")
                    .hasAuthority("SCOPE_ADMIN")

                    // ── Authenticated voter endpoints ───────────────────────────
                    // Token issuance (blind-signature handshake) requires the caller
                    // to be a real, logged-in voter so their role weights and roster
                    // membership can be checked server-side.
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/elections/*/token/request"
                    )
                    .authenticated()
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/elections/*/token/sign"
                    )
                    .authenticated()

                    // Listings the authenticated user can see (filtered by role)
                    .requestMatchers(HttpMethod.GET, "/api/elections")
                    .authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/elections/my-votes")
                    .authenticated()
                    .requestMatchers(HttpMethod.GET, "/api/elections/*")
                    .authenticated()

                    // ── Catch-all ───────────────────────────────────────────────
                    .anyRequest()
                    .authenticated()
            )
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            )
            .build();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(
        SecretKey jwtSecretKey,
        UserRepository userRepository
    ) {
        return new JwtAuthFilter(jwtSecretKey, userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        config.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
