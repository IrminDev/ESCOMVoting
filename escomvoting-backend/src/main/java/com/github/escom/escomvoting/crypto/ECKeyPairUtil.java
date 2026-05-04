package com.github.escom.escomvoting.crypto;

import org.bouncycastle.math.ec.ECPoint;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Base64;

public final class ECKeyPairUtil {

    private static final int GCM_IV_LEN = 12;
    private static final int GCM_TAG_LEN = 128;

    private ECKeyPairUtil() {}

    public record KeyPair(BigInteger privateKey, ECPoint publicKey) {}

    public static KeyPair generate() {
        SecureRandom rng = new SecureRandom();
        BigInteger n = CryptoUtils.DOMAIN.getN();
        BigInteger k;
        do {
            k = new BigInteger(n.bitLength(), rng);
        } while (k.compareTo(BigInteger.ONE) < 0 || k.compareTo(n) >= 0);
        ECPoint P = CryptoUtils.DOMAIN.getG().multiply(k).normalize();
        return new KeyPair(k, P);
    }

    /** Encrypts private key scalar using AES-256-GCM. Returns base64(iv + ciphertext). */
    public static String encryptPrivateKey(BigInteger privateKey, byte[] aesKeyBytes) {
        try {
            byte[] iv = new byte[GCM_IV_LEN];
            new SecureRandom().nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE,
                    new SecretKeySpec(aesKeyBytes, "AES"),
                    new GCMParameterSpec(GCM_TAG_LEN, iv));
            byte[] plaintext = CryptoUtils.bigIntToHex(privateKey).getBytes();
            byte[] ciphertext = cipher.doFinal(plaintext);
            byte[] result = new byte[GCM_IV_LEN + ciphertext.length];
            System.arraycopy(iv, 0, result, 0, GCM_IV_LEN);
            System.arraycopy(ciphertext, 0, result, GCM_IV_LEN, ciphertext.length);
            return Base64.getEncoder().encodeToString(result);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to encrypt private key", e);
        }
    }

    /** Decrypts private key scalar. Input is base64(iv + ciphertext). */
    public static BigInteger decryptPrivateKey(String encryptedB64, byte[] aesKeyBytes) {
        try {
            byte[] data = Base64.getDecoder().decode(encryptedB64);
            byte[] iv = new byte[GCM_IV_LEN];
            System.arraycopy(data, 0, iv, 0, GCM_IV_LEN);
            byte[] ciphertext = new byte[data.length - GCM_IV_LEN];
            System.arraycopy(data, GCM_IV_LEN, ciphertext, 0, ciphertext.length);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE,
                    new SecretKeySpec(aesKeyBytes, "AES"),
                    new GCMParameterSpec(GCM_TAG_LEN, iv));
            byte[] plaintext = cipher.doFinal(ciphertext);
            return CryptoUtils.hexToBigInt(new String(plaintext));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to decrypt private key", e);
        }
    }
}
