CREATE TABLE vote_token_issuances (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    election_id      UUID        NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    r_scalar         TEXT        NOT NULL,
    r_point          TEXT        NOT NULL,
    blinded_challenge TEXT,
    s_response       TEXT,
    stage            VARCHAR(20) NOT NULL DEFAULT 'COMMITTED'
                         CHECK (stage IN ('COMMITTED', 'SIGNED')),
    issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_issuance_user_election UNIQUE (user_id, election_id)
);

CREATE INDEX idx_issuance_election ON vote_token_issuances(election_id);
