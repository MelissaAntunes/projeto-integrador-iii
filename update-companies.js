const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Listar todas as empresas
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    console.log("Lista de empresas:", companies);

    // Atualizar cada empresa individualmente, se necessário
    for (const company of companies) {
      if (company.status !== "ativo" && company.status !== "inativo") {
        await prisma.company.update({
          where: { id: company.id },
          data: { status: "ativo" },
        });
        console.log(`Empresa ${company.name} atualizada com status 'ativo'`);
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar empresas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
