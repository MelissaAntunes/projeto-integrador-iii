import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createCompanySchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {

  const body = await request.json();
  const validation = createCompanySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newCompany = await prisma.company.create({
    data: {
      name: body.name,
      logo_url: body.logo_url,
      description: body.description,
      email: body.email,
      phone: body.phone,
      website: body.website,
      address: body.address,
    }
  });

  return NextResponse.json(newCompany, { status: 201 });
  
}