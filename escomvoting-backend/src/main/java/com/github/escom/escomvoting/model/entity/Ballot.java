package com.github.escom.escomvoting.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ballots")
public class Ballot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    @Column(name = "voter_group", nullable = false, length = 20)
    private UserRole voterGroup;

    @Column(unique = true, nullable = false, length = 64)
    private String nullifier;

    @Column(name = "r_prime", nullable = false, columnDefinition = "TEXT")
    private String rPrime;

    @Column(name = "s_prime", nullable = false, columnDefinition = "TEXT")
    private String sPrime;

    @Column(name = "e_prime", nullable = false, columnDefinition = "TEXT")
    private String ePrime;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private Instant submittedAt;

    public UUID getId() { return id; }
    public Election getElection() { return election; }
    public void setElection(Election election) { this.election = election; }
    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }
    public UserRole getVoterGroup() { return voterGroup; }
    public void setVoterGroup(UserRole voterGroup) { this.voterGroup = voterGroup; }
    public String getNullifier() { return nullifier; }
    public void setNullifier(String nullifier) { this.nullifier = nullifier; }
    public String getRPrime() { return rPrime; }
    public void setRPrime(String rPrime) { this.rPrime = rPrime; }
    public String getSPrime() { return sPrime; }
    public void setSPrime(String sPrime) { this.sPrime = sPrime; }
    public String getEPrime() { return ePrime; }
    public void setEPrime(String ePrime) { this.ePrime = ePrime; }
    public Instant getSubmittedAt() { return submittedAt; }
}
