import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createCompanySchema } from "@/app/validationSchemas";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    console.log(`Buscando empresa com ID: ${id}`);
    
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      console.log(`Empresa com ID ${id} não encontrada`);
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    console.log(`Empresa encontrada:`, company);
    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company details', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  
  try {
    console.log(`Atualizando empresa com ID: ${id}`);
    const body = await request.json();
    console.log('Dados recebidos para atualização:', body);
    
    // Validar os dados recebidos
    const validation = createCompanySchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Erro de validação:', validation.error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id }
    });

    if (!company) {
      console.log(`Empresa com ID ${id} não encontrada`);
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Atualizar a empresa - usar SQL bruto para evitar problemas com o Prisma
    try {
      // Usar executeRaw para queries de atualização
      await prisma.$executeRaw`
        UPDATE companies 
        SET 
          name = ${body.name}, 
          logo_url = ${body.logo_url}, 
          description = ${body.description}, 
          email = ${body.email}, 
          phone = ${body.phone}, 
          website = ${body.website}, 
          address = ${body.address}, 
          "updatedAt" = NOW() 
        WHERE id = ${id}
      `;
      
      // Buscar a empresa atualizada
      const updatedCompany = await prisma.company.findUnique({
        where: { id }
      });
      
      console.log('Empresa atualizada com sucesso:', updatedCompany);
      return NextResponse.json(updatedCompany);
    } catch (dbError) {
      console.error('Erro específico ao atualizar no banco de dados:', dbError);
      return NextResponse.json(
        { error: 'Database update error', details: String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Failed to update company', details: String(error) },
      { status: 500 }
    );
  }
}