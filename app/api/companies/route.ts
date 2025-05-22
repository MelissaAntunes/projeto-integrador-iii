import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createCompanySchema } from "../../validationSchemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.company.count()
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      companies,
      pagination: {
        total: totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Dados recebidos na API POST:', body);
    
    // Validar os dados recebidos
    const validation = createCompanySchema.safeParse(body);

    if (!validation.success) {
      console.error('Erro de validação:', validation.error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    try {
      // Gerar um UUID para o ID
      const id = await prisma.$queryRaw`SELECT uuid_generate_v4() as uuid`;
      const uuid = (id as any)[0].uuid;

      // Usar executeRaw para inserção
      await prisma.$executeRaw`
        INSERT INTO companies (
          id, 
          name, 
          logo_url, 
          description, 
          email, 
          phone, 
          website, 
          address, 
          "createdAt", 
          "updatedAt"
        ) 
        VALUES (
          ${uuid}, 
          ${body.name}, 
          ${body.logo_url}, 
          ${body.description}, 
          ${body.email}, 
          ${body.phone}, 
          ${body.website}, 
          ${body.address}, 
          NOW(), 
          NOW()
        )
      `;
      
      // Buscar a empresa recém-criada
      const newCompany = await prisma.company.findUnique({
        where: { id: uuid }
      });

      console.log('Empresa criada com sucesso:', newCompany);
      return NextResponse.json(newCompany, { status: 201 });
    } catch (dbError) {
      console.error('Erro específico ao inserir no banco de dados:', dbError);
      return NextResponse.json(
        { error: 'Database insertion error', details: String(dbError) },
        { status: 500 }
      );
    }
  
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return NextResponse.json(
      { error: 'Failed to create company', details: String(error) },
      { status: 500 }
    );
  }
}