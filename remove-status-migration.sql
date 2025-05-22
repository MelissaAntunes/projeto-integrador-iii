-- Remover o campo status da tabela companies
ALTER TABLE companies DROP COLUMN IF EXISTS status;

-- Verificar se o tipo enum existe e removê-lo (após verificar se não está sendo usado em outras tabelas)
DO $$
BEGIN
  -- Verificar se o tipo enum existe
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
    -- Verificar se o tipo não está sendo usado em outras tabelas além de companies
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_catalog.pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
      JOIN pg_catalog.pg_type t ON a.atttypid = t.oid
      WHERE t.typname = 'status'
      AND c.relname <> 'companies'
    ) THEN
      -- Remover o tipo enum
      DROP TYPE status;
    END IF;
  END IF;
END
$$; 