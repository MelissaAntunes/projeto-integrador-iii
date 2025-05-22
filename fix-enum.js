const { prisma } = require("./prisma/client");

async function fixEnumType() {
  try {
    console.log("Verificando se o enum Status existe...");

    // Verificar se o tipo enum existe
    const enumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'status'
      );
    `;

    const exists = enumExists[0].exists;

    if (exists) {
      console.log("O tipo enum Status já existe no banco de dados.");
    } else {
      console.log("O tipo enum Status não existe. Criando...");

      // Criar o tipo enum
      await prisma.$executeRaw`
        CREATE TYPE status AS ENUM ('ativo', 'inativo');
      `;

      console.log("Tipo enum Status criado com sucesso!");
    }

    // Verificar configuração da coluna status
    console.log("Verificando a coluna status na tabela companies...");

    const columnInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'companies' AND column_name = 'status';
    `;

    console.log("Informações da coluna status:", columnInfo);

    if (columnInfo.length > 0) {
      // Atualizar todas as empresas existentes para o status 'ativo' se for null
      const updateResult = await prisma.$executeRaw`
        UPDATE companies SET status = 'ativo' WHERE status IS NULL
      `;

      console.log(`${updateResult} empresas atualizadas para status 'ativo'.`);
    }

    console.log("Correção concluída com sucesso!");
  } catch (error) {
    console.error("Erro ao corrigir o tipo enum:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEnumType();
