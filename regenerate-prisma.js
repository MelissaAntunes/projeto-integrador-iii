const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Verificar se o arquivo schema_fixed.prisma existe
if (!fs.existsSync(path.join(__dirname, "prisma", "schema_fixed.prisma"))) {
  console.error("O arquivo schema_fixed.prisma não foi encontrado!");
  process.exit(1);
}

// Fazer backup do schema original
if (fs.existsSync(path.join(__dirname, "prisma", "schema.prisma"))) {
  fs.copyFileSync(
    path.join(__dirname, "prisma", "schema.prisma"),
    path.join(__dirname, "prisma", "schema.prisma.bak")
  );
  console.log("Backup do schema original criado.");
}

// Copiar o schema simplificado
fs.copyFileSync(
  path.join(__dirname, "prisma", "schema_fixed.prisma"),
  path.join(__dirname, "prisma", "schema.prisma")
);
console.log("Schema simplificado copiado.");

// Executar prisma generate
exec("npx prisma generate", (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar prisma generate: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Erro: ${stderr}`);
    return;
  }

  console.log(`Saída do prisma generate: ${stdout}`);
  console.log("Prisma Client regenerado com sucesso!");

  // Restaurar o schema original
  if (fs.existsSync(path.join(__dirname, "prisma", "schema.prisma.bak"))) {
    fs.copyFileSync(
      path.join(__dirname, "prisma", "schema.prisma.bak"),
      path.join(__dirname, "prisma", "schema.prisma")
    );
    console.log("Schema original restaurado.");
  }
});
