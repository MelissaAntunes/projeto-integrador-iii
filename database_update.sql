-- Criar o tipo enum se não existir
CREATE TYPE IF NOT EXISTS status AS ENUM ('ativo', 'inativo');

-- Garantir que a coluna status tenha o tipo correto
ALTER TABLE companies ALTER COLUMN status TYPE VARCHAR(255);

-- Atualizar qualquer valor nulo ou vazio para 'ativo'
UPDATE companies SET status = 'ativo' WHERE status IS NULL OR status = '';

-- Converter a coluna para o tipo enum
ALTER TABLE companies ALTER COLUMN status TYPE status USING status::status;

-- Definir valor padrão como 'ativo'
ALTER TABLE companies ALTER COLUMN status SET DEFAULT 'ativo'::status; 