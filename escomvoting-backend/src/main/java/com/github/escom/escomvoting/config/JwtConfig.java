package com.github.escom.escomvoting.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecretHex;

    @Value("${app.jwt.expiry-ms}")
    private long expiryMs;

    @Bean
    public SecretKey jwtSecretKey() {
        byte[] bytes = hexToBytes(jwtSecretHex);
        return Keys.hmacShaKeyFor(bytes);
    }

    @Bean
    public long jwtExpiryMs() {
        return expiryMs;
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }
}
