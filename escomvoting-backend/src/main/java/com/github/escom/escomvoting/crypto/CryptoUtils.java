package com.github.escom.escomvoting.crypto;

import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.bouncycastle.math.ec.ECPoint;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class CryptoUtils {

    public static final String CURVE_NAME = "secp256k1";

    private static final ECNamedCurveParameterSpec SPEC =
            ECNamedCurveTable.getParameterSpec(CURVE_NAME);

    public static final ECDomainParameters DOMAIN = new ECDomainParameters(
            SPEC.getCurve(), SPEC.getG(), SPEC.getN(), SPEC.getH()
    );

    private CryptoUtils() {}

    public static String bigIntToHex(BigInteger n) {
        String hex = n.toString(16);
        // Pad to 64 hex chars (32 bytes)
        return hex.length() < 64 ? "0".repeat(64 - hex.length()) + hex : hex;
    }

    public static BigInteger hexToBigInt(String hex) {
        return new BigInteger(hex, 16);
    }

    public static String pointToHex(ECPoint point) {
        byte[] encoded = point.getEncoded(false); // uncompressed: 65 bytes
        return bytesToHex(encoded);
    }

    public static ECPoint hexToPoint(String hex) {
        byte[] bytes = hexToBytes(hex);
        return DOMAIN.getCurve().decodePoint(bytes);
    }

    public static byte[] sha256(byte[]... inputs) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            for (byte[] input : inputs) {
                digest.update(input);
            }
            return digest.digest();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public static byte[] sha256(String... inputs) {
        byte[][] parts = new byte[inputs.length][];
        for (int i = 0; i < inputs.length; i++) {
            parts[i] = inputs[i].getBytes(StandardCharsets.UTF_8);
        }
        return sha256(parts);
    }

    public static BigInteger sha256AsBigInt(byte[]... inputs) {
        return new BigInteger(1, sha256(inputs)).mod(DOMAIN.getN());
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }
}
