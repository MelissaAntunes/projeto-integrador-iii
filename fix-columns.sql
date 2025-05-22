-- Verificar se o tipo enum existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
    CREATE TYPE status AS ENUM ('ativo', 'inativo');
  END IF;
END
$$;

-- Verificar se a coluna existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'status') THEN
    -- Alterar o tipo da coluna para texto temporariamente
    ALTER TABLE companies ALTER COLUMN status TYPE TEXT;
    
    -- Alterar o tipo de volta para enum com validação dos valores
    UPDATE companies SET status = 'ativo' WHERE status IS NULL OR status NOT IN ('ativo', 'inativo');
    ALTER TABLE companies ALTER COLUMN status TYPE status USING status::status;
    
    -- Adicionar valor padrão
    ALTER TABLE companies ALTER COLUMN status SET DEFAULT 'ativo';
  END IF;
END
$$; 