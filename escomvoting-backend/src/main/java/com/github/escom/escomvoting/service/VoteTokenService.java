package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.crypto.CryptoUtils;
import com.github.escom.escomvoting.crypto.ECKeyPairUtil;
import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.TokenRequestResponse;
import com.github.escom.escomvoting.model.dto.TokenSignResponse;
import com.github.escom.escomvoting.model.entity.*;
import com.github.escom.escomvoting.repository.VoteTokenIssuanceRepository;
import org.bouncycastle.math.ec.ECPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.UUID;

@Service
public class VoteTokenService {

    private final VoteTokenIssuanceRepository issuanceRepository;
    private final ElectionService electionService;
    private final byte[] electionKeySecret;

    public VoteTokenService(VoteTokenIssuanceRepository issuanceRepository,
                            ElectionService electionService,
                            byte[] electionKeySecret) {
        this.issuanceRepository = issuanceRepository;
        this.electionService = electionService;
        this.electionKeySecret = electionKeySecret;
    }

    /**
     * Step 1: Generate r, compute R = r·G, persist COMMITTED state.
     * Returns R (hex) and the role-specific public key P so the client blinds
     * against the key that matches its authenticated role. This is what prevents
     * group spoofing: each role has a distinct key pair, so a STUDENT cannot
     * produce a valid PROFESSOR-keyed signature.
     */
    @Transactional
    public TokenRequestResponse requestToken(UUID electionId, User user) {
        Election election = electionService.findOrThrow(electionId);

        if (election.getStatus() != ElectionStatus.OPEN) {
            throw VotingException.badRequest("Election is not open");
        }

        if (!isEligible(user, election)) {
            throw VotingException.forbidden("Your role is not allowed in this election");
        }

        UserRole role = user.getRole();
        String rolePublicKey = election.getPublicKeyForRole(role);
        if (rolePublicKey == null) {
            throw VotingException.badRequest("No key configured for role " + role);
        }

        if (issuanceRepository.existsByUserIdAndElectionId(user.getId(), electionId)) {
            VoteTokenIssuance existing = issuanceRepository
                    .findByUserIdAndElectionId(user.getId(), electionId).orElseThrow();
            if (existing.getStage() == VoteTokenIssuance.Stage.SIGNED) {
                throw VotingException.conflict("Token already signed for this election");
            }
            return new TokenRequestResponse(existing.getRPoint(), rolePublicKey);
        }

        SecureRandom rng = new SecureRandom();
        BigInteger n = CryptoUtils.DOMAIN.getN();
        BigInteger r;
        do {
            r = new BigInteger(n.bitLength(), rng);
        } while (r.compareTo(BigInteger.ONE) < 0 || r.compareTo(n) >= 0);

        ECPoint R = CryptoUtils.DOMAIN.getG().multiply(r).normalize();

        VoteTokenIssuance issuance = new VoteTokenIssuance();
        issuance.setUser(user);
        issuance.setElection(election);
        issuance.setRScalar(CryptoUtils.bigIntToHex(r));
        issuance.setRPoint(CryptoUtils.pointToHex(R));
        issuanceRepository.save(issuance);

        return new TokenRequestResponse(CryptoUtils.pointToHex(R), rolePublicKey);
    }

    /**
     * Step 3: Receive blinded challenge c, compute s = r - k·c (mod n)
     * using the role-specific private key k. The private key used here must
     * match the public key the client blinded against, so the resulting
     * signature will only verify under the voter's actual role key.
     */
    @Transactional
    public TokenSignResponse signToken(UUID electionId, User user, String blindedChallengeHex) {
        VoteTokenIssuance issuance = issuanceRepository
                .findByUserIdAndElectionId(user.getId(), electionId)
                .orElseThrow(() -> VotingException.badRequest("No token request found for this election"));

        if (issuance.getStage() == VoteTokenIssuance.Stage.SIGNED) {
            throw VotingException.conflict("Token already signed");
        }

        Election election = issuance.getElection();
        if (election.getStatus() != ElectionStatus.OPEN) {
            throw VotingException.badRequest("Election is no longer open");
        }

        String privateKeyEnc = election.getPrivateKeyEncForRole(user.getRole());
        if (privateKeyEnc == null) {
            throw VotingException.badRequest("No key configured for role " + user.getRole());
        }

        BigInteger n = CryptoUtils.DOMAIN.getN();
        BigInteger r = CryptoUtils.hexToBigInt(issuance.getRScalar());
        BigInteger k = ECKeyPairUtil.decryptPrivateKey(privateKeyEnc, electionKeySecret);
        BigInteger c = CryptoUtils.hexToBigInt(blindedChallengeHex);

        BigInteger s = r.subtract(k.multiply(c)).mod(n);

        issuance.setBlindedChallenge(blindedChallengeHex);
        issuance.setSResponse(CryptoUtils.bigIntToHex(s));
        issuance.setStage(VoteTokenIssuance.Stage.SIGNED);
        issuanceRepository.save(issuance);

        k = BigInteger.ZERO;

        return new TokenSignResponse(CryptoUtils.bigIntToHex(s));
    }

    private boolean isEligible(User user, Election election) {
        return Arrays.asList(election.getAllowedRoles()).contains(user.getRole().name());
    }
}
