package com.github.escom.escomvoting.config;

import com.github.escom.escomvoting.crypto.CryptoUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Security;

@Configuration
public class CryptoConfig {

    @Value("${app.crypto.election-key-secret}")
    private String electionKeySecretHex;

    static {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @Bean
    public byte[] electionKeySecret() {
        return CryptoUtils.hexToBytes(electionKeySecretHex);
    }
}
