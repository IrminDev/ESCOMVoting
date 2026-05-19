-- Decouple admin privilege from role. SCOPE_ADMIN is now granted by an explicit
-- per-user flag instead of being implicit to the PAAE role. Existing PAAE users
-- are backfilled as admins so current behavior is preserved on first deploy.

ALTER TABLE users
    ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

UPDATE users SET is_admin = true WHERE role = 'PAAE';
