CREATE TABLE ballots (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id  UUID        NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id UUID        NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    voter_group  VARCHAR(20) NOT NULL CHECK (voter_group IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    nullifier    VARCHAR(64) UNIQUE NOT NULL,
    r_prime      TEXT        NOT NULL,
    s_prime      TEXT        NOT NULL,
    e_prime      TEXT        NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ballots_election ON ballots(election_id);
CREATE INDEX idx_ballots_candidate ON ballots(candidate_id);
CREATE INDEX idx_ballots_group ON ballots(election_id, voter_group);

CREATE TABLE election_results (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id    UUID           NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id   UUID           NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    vote_count     INTEGER        NOT NULL,
    weighted_score NUMERIC(12, 8) NOT NULL,
    computed_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_result_candidate UNIQUE (election_id, candidate_id)
);
