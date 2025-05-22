const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("=== Verificando configuração do banco de dados ===");

    // Verificar se o tipo enum existe
    const enumInfo = await prisma.$queryRaw`
      SELECT 
        t.typname, 
        e.enumlabel
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname = 'status'
      ORDER BY e.enumsortorder;
    `;

    if (enumInfo.length > 0) {
      console.log("Tipo enum Status existe com os seguintes valores:");
      enumInfo.forEach((item) => {
        console.log(`- ${item.enumlabel}`);
      });
    } else {
      console.log("O tipo enum Status não existe no banco de dados!");
    }

    // Verificar a estrutura da coluna status
    const columnInfo = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        udt_name,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'companies' AND column_name = 'status';
    `;

    if (columnInfo.length > 0) {
      console.log("\nInformações da coluna status na tabela companies:");
      console.log(columnInfo[0]);
    } else {
      console.log("\nA coluna status não existe na tabela companies!");
    }

    // Verificar dados existentes na tabela
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    console.log("\nEmpresas existentes:");
    companies.forEach((company) => {
      console.log(
        `${company.id} | ${company.name} | Status: ${company.status || "NULL"}`
      );
    });
  } catch (error) {
    console.error("Erro ao verificar banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
