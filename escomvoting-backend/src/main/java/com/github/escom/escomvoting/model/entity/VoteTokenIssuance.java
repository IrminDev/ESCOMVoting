package com.github.escom.escomvoting.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vote_token_issuances")
public class VoteTokenIssuance {

    public enum Stage { COMMITTED, SIGNED }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "r_scalar", nullable = false, columnDefinition = "TEXT")
    private String rScalar;

    @Column(name = "r_point", nullable = false, columnDefinition = "TEXT")
    private String rPoint;

    @Column(name = "blinded_challenge", columnDefinition = "TEXT")
    private String blindedChallenge;

    @Column(name = "s_response", columnDefinition = "TEXT")
    private String sResponse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Stage stage = Stage.COMMITTED;

    @CreationTimestamp
    @Column(name = "issued_at", nullable = false, updatable = false)
    private Instant issuedAt;

    public UUID getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Election getElection() { return election; }
    public void setElection(Election election) { this.election = election; }
    public String getRScalar() { return rScalar; }
    public void setRScalar(String rScalar) { this.rScalar = rScalar; }
    public String getRPoint() { return rPoint; }
    public void setRPoint(String rPoint) { this.rPoint = rPoint; }
    public String getBlindedChallenge() { return blindedChallenge; }
    public void setBlindedChallenge(String blindedChallenge) { this.blindedChallenge = blindedChallenge; }
    public String getSResponse() { return sResponse; }
    public void setSResponse(String sResponse) { this.sResponse = sResponse; }
    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }
    public Instant getIssuedAt() { return issuedAt; }
}
