package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.crypto.SchnorrVerifier;
import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.BallotSubmission;
import com.github.escom.escomvoting.model.entity.*;
import com.github.escom.escomvoting.repository.BallotRepository;
import com.github.escom.escomvoting.repository.CandidateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VoteService {

    private final BallotRepository ballotRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionService electionService;

    public VoteService(BallotRepository ballotRepository,
                       CandidateRepository candidateRepository,
                       ElectionService electionService) {
        this.ballotRepository = ballotRepository;
        this.candidateRepository = candidateRepository;
        this.electionService = electionService;
    }

    @Transactional
    public void submitBallot(UUID electionId, BallotSubmission submission) {
        Election election = electionService.findOrThrow(electionId);

        if (election.getStatus() != ElectionStatus.OPEN) {
            throw VotingException.badRequest("Election is not open");
        }

        if (ballotRepository.existsByNullifier(submission.nullifier())) {
            throw VotingException.conflict("This ballot has already been submitted");
        }

        UserRole voterGroup;
        try {
            voterGroup = UserRole.valueOf(submission.voterGroup().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw VotingException.badRequest("Invalid voter group: " + submission.voterGroup());
        }

        Candidate candidate = candidateRepository.findById(submission.candidateId())
                .orElseThrow(() -> VotingException.notFound("Candidate not found"));

        if (!candidate.getElection().getId().equals(electionId)) {
            throw VotingException.badRequest("Candidate does not belong to this election");
        }

        String rolePublicKey = election.getPublicKeyForRole(voterGroup);
        if (rolePublicKey == null) {
            throw VotingException.badRequest("No key configured for role " + submission.voterGroup());
        }

        boolean valid = SchnorrVerifier.verify(new SchnorrVerifier.VerificationInput(
                submission.rPrime(),
                submission.sPrime(),
                submission.ePrime(),
                rolePublicKey,
                electionId,
                submission.candidateId(),
                submission.voterGroup().toUpperCase()
        ));

        if (!valid) {
            throw VotingException.badRequest("Invalid ballot signature");
        }

        Ballot ballot = new Ballot();
        ballot.setElection(election);
        ballot.setCandidate(candidate);
        ballot.setVoterGroup(voterGroup);
        ballot.setNullifier(submission.nullifier());
        ballot.setRPrime(submission.rPrime());
        ballot.setSPrime(submission.sPrime());
        ballot.setEPrime(submission.ePrime());
        ballotRepository.save(ballot);
    }
}
