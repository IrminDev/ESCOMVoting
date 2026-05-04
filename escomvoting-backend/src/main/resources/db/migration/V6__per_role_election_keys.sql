-- Replace single election key pair with one pair per allowed role
ALTER TABLE elections
    ADD COLUMN public_key_student VARCHAR(132),
    ADD COLUMN private_key_enc_student TEXT,
    ADD COLUMN public_key_professor VARCHAR(132),
    ADD COLUMN private_key_enc_professor TEXT,
    ADD COLUMN public_key_admin VARCHAR(132),
    ADD COLUMN private_key_enc_admin TEXT;
