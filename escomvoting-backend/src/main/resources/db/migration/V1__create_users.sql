CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    institutional_id VARCHAR(30) UNIQUE NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    name             VARCHAR(255) NOT NULL,
    role             VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN')),
    password_hash    VARCHAR(255) NOT NULL,
    active           BOOLEAN     NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
