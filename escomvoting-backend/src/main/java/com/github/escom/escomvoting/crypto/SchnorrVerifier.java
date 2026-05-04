package com.github.escom.escomvoting.crypto;

import org.bouncycastle.math.ec.ECPoint;

import java.math.BigInteger;
import java.util.UUID;

/**
 * Verifies a blind Schnorr signature on a ballot.
 *
 * Protocol invariant (proved in plan):
 *   s'·G + e'·P = R'
 *   where e' = SHA-256(R' ∥ SHA-256(electionId ∥ candidateId ∥ voterGroup))
 */
public final class SchnorrVerifier {

    private SchnorrVerifier() {}

    public record VerificationInput(
            String rPrimeHex,
            String sPrimeHex,
            String ePrimeHex,
            String publicKeyHex,
            UUID electionId,
            UUID candidateId,
            String voterGroup
    ) {}

    public static boolean verify(VerificationInput input) {
        ECPoint P = CryptoUtils.hexToPoint(input.publicKeyHex());
        ECPoint RPrime = CryptoUtils.hexToPoint(input.rPrimeHex());
        BigInteger sPrime = CryptoUtils.hexToBigInt(input.sPrimeHex());
        BigInteger ePrime = CryptoUtils.hexToBigInt(input.ePrimeHex());
        BigInteger n = CryptoUtils.DOMAIN.getN();

        // Recompute expected e'
        byte[] m = CryptoUtils.sha256(
                input.electionId().toString(),
                input.candidateId().toString(),
                input.voterGroup()
        );
        BigInteger expectedEPrime = CryptoUtils.sha256AsBigInt(
                CryptoUtils.hexToBytes(input.rPrimeHex()),
                m
        );

        if (!expectedEPrime.equals(ePrime.mod(n))) {
            return false;
        }

        // Verify s'·G + e'·P = R'
        ECPoint lhs = CryptoUtils.DOMAIN.getG()
                .multiply(sPrime.mod(n))
                .add(P.multiply(ePrime.mod(n)))
                .normalize();

        ECPoint rhs = RPrime.normalize();

        return lhs.equals(rhs);
    }
}
