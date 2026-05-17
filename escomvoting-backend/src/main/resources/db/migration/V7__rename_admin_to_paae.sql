-- Rename ADMIN role to PAAE across all tables

-- 1. Drop old role check constraint (must happen before updating data)
DO $$
DECLARE
  cname TEXT;
BEGIN
  SELECT tc.constraint_name INTO cname
  FROM information_schema.table_constraints tc
  JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
  WHERE tc.table_name = 'users'
    AND tc.constraint_type = 'CHECK'
    AND cc.check_clause LIKE '%ADMIN%'
  LIMIT 1;

  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', cname);
  END IF;
END $$;

-- 2. Update existing ADMIN users to PAAE
UPDATE users SET role = 'PAAE' WHERE role = 'ADMIN';

-- 3. Add new role check constraint
ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('STUDENT', 'PROFESSOR', 'PAAE'));

-- 4. Update allowed_roles arrays in elections (ADMIN -> PAAE)
UPDATE elections
SET allowed_roles = array_replace(allowed_roles, 'ADMIN', 'PAAE')
WHERE allowed_roles IS NOT NULL AND 'ADMIN' = ANY(allowed_roles);
