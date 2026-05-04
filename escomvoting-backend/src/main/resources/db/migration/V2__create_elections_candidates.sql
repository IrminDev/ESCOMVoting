CREATE TABLE elections (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    start_date       TIMESTAMPTZ NOT NULL,
    end_date         TIMESTAMPTZ NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                         CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED', 'TALLIED')),
    allowed_roles    TEXT[]      NOT NULL,
    public_key_hex   VARCHAR(132),
    private_key_enc  TEXT,
    created_by       UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT elections_dates_check CHECK (end_date > start_date)
);

CREATE INDEX idx_elections_status ON elections(status);

CREATE TABLE candidates (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID        NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    position    INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX idx_candidates_election ON candidates(election_id);
