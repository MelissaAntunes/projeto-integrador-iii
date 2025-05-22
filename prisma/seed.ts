import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Atualizar todas as empresas existentes para ter o status "ativo"
  const companies = await prisma.company.findMany();
  
  console.log(`Encontradas ${companies.length} empresas para atualizar.`);
  
  for (const company of companies) {
    if (!company.status) {
      await prisma.company.update({
        where: { id: company.id },
        data: { status: 'ativo' }
      });
      console.log(`Empresa ${company.name} atualizada com status 'ativo'`);
    }
  }
  
  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 