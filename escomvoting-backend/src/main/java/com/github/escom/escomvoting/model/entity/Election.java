package com.github.escom.escomvoting.model.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "elections")
public class Election {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ElectionStatus status = ElectionStatus.DRAFT;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "allowed_roles", columnDefinition = "TEXT[]", nullable = false)
    private String[] allowedRoles;

    // Legacy single-key columns kept for schema compatibility — per-role keys used instead
    @Column(name = "public_key_hex", length = 132)
    private String publicKeyHex;

    @Column(name = "private_key_enc", columnDefinition = "TEXT")
    private String privateKeyEnc;

    // Per-role key pairs — generated for each role present in allowedRoles
    @Column(name = "public_key_student", length = 132)
    private String publicKeyStudent;

    @Column(name = "private_key_enc_student", columnDefinition = "TEXT")
    private String privateKeyEncStudent;

    @Column(name = "public_key_professor", length = 132)
    private String publicKeyProfessor;

    @Column(name = "private_key_enc_professor", columnDefinition = "TEXT")
    private String privateKeyEncProfessor;

    @Column(name = "public_key_admin", length = 132)
    private String publicKeyAdmin;

    @Column(name = "private_key_enc_admin", columnDefinition = "TEXT")
    private String privateKeyEncAdmin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "election", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<Candidate> candidates = new ArrayList<>();

    // Role-keyed accessors — callers use these instead of the legacy single-key fields
    public String getPublicKeyForRole(UserRole role) {
        return switch (role) {
            case STUDENT   -> publicKeyStudent;
            case PROFESSOR -> publicKeyProfessor;
            case PAAE      -> publicKeyAdmin;
        };
    }

    public String getPrivateKeyEncForRole(UserRole role) {
        return switch (role) {
            case STUDENT   -> privateKeyEncStudent;
            case PROFESSOR -> privateKeyEncProfessor;
            case PAAE      -> privateKeyEncAdmin;
        };
    }

    public void setKeyPairForRole(UserRole role, String pubHex, String privEnc) {
        switch (role) {
            case STUDENT   -> { publicKeyStudent = pubHex;   privateKeyEncStudent = privEnc; }
            case PROFESSOR -> { publicKeyProfessor = pubHex; privateKeyEncProfessor = privEnc; }
            case PAAE      -> { publicKeyAdmin = pubHex;     privateKeyEncAdmin = privEnc; }
        }
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getStartDate() { return startDate; }
    public void setStartDate(Instant startDate) { this.startDate = startDate; }
    public Instant getEndDate() { return endDate; }
    public void setEndDate(Instant endDate) { this.endDate = endDate; }
    public ElectionStatus getStatus() { return status; }
    public void setStatus(ElectionStatus status) { this.status = status; }
    public String[] getAllowedRoles() { return allowedRoles; }
    public void setAllowedRoles(String[] allowedRoles) { this.allowedRoles = allowedRoles; }
    public String getPublicKeyHex() { return publicKeyHex; }
    public void setPublicKeyHex(String publicKeyHex) { this.publicKeyHex = publicKeyHex; }
    public String getPrivateKeyEnc() { return privateKeyEnc; }
    public void setPrivateKeyEnc(String privateKeyEnc) { this.privateKeyEnc = privateKeyEnc; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public List<Candidate> getCandidates() { return candidates; }
}
