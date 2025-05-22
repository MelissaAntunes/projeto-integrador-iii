const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function executeMigration() {
  try {
    console.log("Iniciando migração para remover campo status...");

    // Remover o campo status da tabela companies
    console.log("Removendo coluna status da tabela companies...");
    await prisma.$executeRaw`ALTER TABLE companies DROP COLUMN IF EXISTS status;`;

    // Verificar se o tipo enum existe e removê-lo
    console.log("Verificando e removendo tipo enum Status...");
    const typeExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'status'
      );
    `;

    if (typeExists[0].exists) {
      // Verificar se o tipo não está sendo usado em outras tabelas
      const usedInOtherTables = await prisma.$queryRaw`
        SELECT 1 
        FROM pg_catalog.pg_class c
        JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
        JOIN pg_catalog.pg_type t ON a.atttypid = t.oid
        WHERE t.typname = 'status'
        AND c.relname <> 'companies'
        LIMIT 1;
      `;

      if (usedInOtherTables.length === 0) {
        console.log("Removendo tipo enum status...");
        await prisma.$executeRaw`DROP TYPE IF EXISTS status;`;
      } else {
        console.log(
          "Tipo enum 'status' está sendo usado em outras tabelas. Não será removido."
        );
      }
    } else {
      console.log("Tipo enum 'status' não encontrado.");
    }

    console.log("Migração concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao executar migração:", error);
  } finally {
    await prisma.$disconnect();
  }
}

executeMigration();
