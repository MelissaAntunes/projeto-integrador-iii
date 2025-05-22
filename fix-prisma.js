// Importação direta do PrismaClient para evitar problemas com o cliente singleton
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar e criar uma nova empresa com status definido como string simples
    const count = await prisma.company.count();

    console.log(`Número de empresas encontradas: ${count}`);

    if (count > 0) {
      console.log("Atualizando empresas existentes...");

      // Usar uma abordagem direta do banco de dados para atualizar o status
      const companies = await prisma.company.findMany({
        select: { id: true },
      });

      console.log(`Empresas encontradas: ${companies.length}`);

      for (const company of companies) {
        // Atualizar cada empresa para garantir que o status seja definido
        try {
          await prisma.$executeRaw`
            UPDATE companies 
            SET status = 'ativo' 
            WHERE id = ${company.id} AND (status IS NULL OR status = '')
          `;
          console.log(`Empresa ${company.id} atualizada com sucesso.`);
        } catch (err) {
          console.error(`Erro ao atualizar empresa ${company.id}:`, err);
        }
      }
    }

    console.log("Operação concluída com sucesso!");
  } catch (error) {
    console.error("Erro durante a operação:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
