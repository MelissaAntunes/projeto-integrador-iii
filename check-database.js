const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("=== Verificando configuração do banco de dados ===");

    // Verificar a estrutura da tabela companies
    console.log("\nEstrutura da tabela companies:");
    const columns = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        udt_name
      FROM information_schema.columns
      WHERE table_name = 'companies'
      ORDER BY ordinal_position;
    `;

    columns.forEach((column) => {
      console.log(`- ${column.column_name} (${column.data_type})`);
    });

    // Verificar se o tipo enum status ainda existe
    console.log("\nVerificando se o enum Status existe:");
    const enumTypes = await prisma.$queryRaw`
      SELECT typname 
      FROM pg_type 
      WHERE typname = 'status';
    `;

    if (enumTypes.length > 0) {
      console.log("O tipo enum 'status' ainda existe no banco de dados.");
    } else {
      console.log("O tipo enum 'status' foi removido com sucesso!");
    }

    // Verificar dados existentes na tabela
    console.log("\nVerificando empresas existentes:");
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 5,
    });

    if (companies.length > 0) {
      console.log(`Encontradas ${companies.length} empresas:`);
      companies.forEach((company) => {
        console.log(`- ${company.name} (${company.id})`);
      });
    } else {
      console.log("Não foram encontradas empresas no banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao verificar banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
