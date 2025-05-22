const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const company = await prisma.company.create({
      data: {
        name: "Empresa Teste",
        logo_url: "https://via.placeholder.com/150",
        description: "Uma empresa para testes",
        email: "teste@empresa.com",
        phone: "(11) 1234-5678",
        website: "www.empresateste.com",
        address: "Av. Teste, 123",
        status: "ativo",
      },
    });

    console.log("Empresa criada com sucesso:", company);
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
