package com.github.escom.escomvoting.service;

import com.github.escom.escomvoting.crypto.ECKeyPairUtil;
import com.github.escom.escomvoting.crypto.CryptoUtils;
import com.github.escom.escomvoting.exception.VotingException;
import com.github.escom.escomvoting.model.dto.CreateElectionRequest;
import com.github.escom.escomvoting.model.dto.ElectionDTO;
import com.github.escom.escomvoting.model.entity.*;
import com.github.escom.escomvoting.repository.CandidateRepository;
import com.github.escom.escomvoting.repository.ElectionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final byte[] electionKeySecret;

    public ElectionService(ElectionRepository electionRepository,
                           CandidateRepository candidateRepository,
                           byte[] electionKeySecret) {
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.electionKeySecret = electionKeySecret;
    }

    public List<ElectionDTO> listAll() {
        return electionRepository.findAll().stream().map(ElectionDTO::from).toList();
    }

    public Page<ElectionDTO> listAll(Pageable pageable) {
        return electionRepository.findAll(pageable).map(ElectionDTO::from);
    }

    public Page<ElectionDTO> listOpenForRole(String role, Pageable pageable) {
        return electionRepository.findOpenElectionsForRole(role, pageable).map(ElectionDTO::from);
    }

    public Page<ElectionDTO> listFinished(Pageable pageable) {
        return electionRepository.findAllByStatusIn(
                List.of(ElectionStatus.CLOSED, ElectionStatus.TALLIED), pageable
        ).map(ElectionDTO::from);
    }

    public ElectionDTO getById(UUID id) {
        return ElectionDTO.from(findOrThrow(id));
    }

    @Transactional
    public ElectionDTO create(CreateElectionRequest req, User admin) {
        if (req.allowedRoles() == null || req.allowedRoles().isEmpty()) {
            throw VotingException.badRequest("At least one allowed role required");
        }
        validateRoles(req.allowedRoles());

        Election election = new Election();
        election.setTitle(req.title());
        election.setDescription(req.description());
        election.setStartDate(req.startDate());
        election.setEndDate(req.endDate());
        election.setAllowedRoles(req.allowedRoles().toArray(new String[0]));
        election.setCreatedBy(admin);

        // Generate a separate key pair for each allowed role — prevents group spoofing
        for (String roleStr : req.allowedRoles()) {
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            ECKeyPairUtil.KeyPair kp = ECKeyPairUtil.generate();
            election.setKeyPairForRole(role,
                    CryptoUtils.pointToHex(kp.publicKey()),
                    ECKeyPairUtil.encryptPrivateKey(kp.privateKey(), electionKeySecret));
        }
        electionRepository.save(election);

        if (req.candidates() != null) {
            for (int i = 0; i < req.candidates().size(); i++) {
                var input = req.candidates().get(i);
                Candidate c = new Candidate();
                c.setElection(election);
                c.setName(input.name());
                c.setDescription(input.description());
                c.setPosition(i);
                candidateRepository.save(c);
            }
        }

        return ElectionDTO.from(electionRepository.findById(election.getId()).orElseThrow());
    }

    @Transactional
    public ElectionDTO update(UUID id, CreateElectionRequest req) {
        Election election = findOrThrow(id);
        if (election.getStatus() != ElectionStatus.DRAFT) {
            throw VotingException.badRequest("Only DRAFT elections can be updated");
        }
        if (req.allowedRoles() == null || req.allowedRoles().isEmpty()) {
            throw VotingException.badRequest("At least one allowed role required");
        }
        validateRoles(req.allowedRoles());

        election.setTitle(req.title());
        election.setDescription(req.description());
        election.setStartDate(req.startDate());
        election.setEndDate(req.endDate());
        election.setAllowedRoles(req.allowedRoles().toArray(new String[0]));

        election.setKeyPairForRole(UserRole.STUDENT, null, null);
        election.setKeyPairForRole(UserRole.PROFESSOR, null, null);
        election.setKeyPairForRole(UserRole.PAAE, null, null);

        for (String roleStr : req.allowedRoles()) {
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            ECKeyPairUtil.KeyPair kp = ECKeyPairUtil.generate();
            election.setKeyPairForRole(role,
                    CryptoUtils.pointToHex(kp.publicKey()),
                    ECKeyPairUtil.encryptPrivateKey(kp.privateKey(), electionKeySecret));
        }

        election.getCandidates().clear();

        if (req.candidates() != null) {
            for (int i = 0; i < req.candidates().size(); i++) {
                var input = req.candidates().get(i);
                Candidate c = new Candidate();
                c.setElection(election);
                c.setName(input.name());
                c.setDescription(input.description());
                c.setPosition(i);
                election.getCandidates().add(c);
            }
        }

        return ElectionDTO.from(electionRepository.save(election));
    }

    @Transactional
    public ElectionDTO updateStatus(UUID id, String newStatus) {
        Election election = findOrThrow(id);
        ElectionStatus next = parseStatus(newStatus);
        validateTransition(election.getStatus(), next);
        election.setStatus(next);
        return ElectionDTO.from(electionRepository.save(election));
    }

    public Election findOrThrow(UUID id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> VotingException.notFound("Election not found: " + id));
    }

    private void validateTransition(ElectionStatus current, ElectionStatus next) {
        boolean valid = switch (current) {
            case DRAFT -> next == ElectionStatus.OPEN;
            case OPEN -> next == ElectionStatus.CLOSED;
            case CLOSED -> next == ElectionStatus.TALLIED;
            case TALLIED -> false;
        };
        if (!valid) {
            throw VotingException.badRequest("Cannot transition from " + current + " to " + next);
        }
    }

    private ElectionStatus parseStatus(String s) {
        try {
            return ElectionStatus.valueOf(s.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw VotingException.badRequest("Unknown status: " + s);
        }
    }

    private void validateRoles(List<String> roles) {
        for (String role : roles) {
            try {
                UserRole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw VotingException.badRequest("Unknown role: " + role);
            }
        }
    }
}
