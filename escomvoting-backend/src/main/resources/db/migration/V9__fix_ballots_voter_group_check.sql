-- V7 renamed ADMIN→PAAE in users but missed the ballots.voter_group check constraint.
-- Drop the old constraint, backfill any stale ADMIN rows, add the corrected constraint.

DO $$
DECLARE
  cname TEXT;
BEGIN
  SELECT tc.constraint_name INTO cname
  FROM information_schema.table_constraints tc
  JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
  WHERE tc.table_name = 'ballots'
    AND tc.constraint_type = 'CHECK'
    AND cc.check_clause LIKE '%ADMIN%'
  LIMIT 1;

  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE ballots DROP CONSTRAINT %I', cname);
  END IF;
END $$;

UPDATE ballots SET voter_group = 'PAAE' WHERE voter_group = 'ADMIN';

ALTER TABLE ballots ADD CONSTRAINT ballots_voter_group_check
    CHECK (voter_group IN ('STUDENT', 'PROFESSOR', 'PAAE'));
