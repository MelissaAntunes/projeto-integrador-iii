import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/prisma/client";

const createCompanySchema = z.object({
    name: z.string().min(1),
    logo_url: z.string().min(1),
    description: z.string().min(1),
    email: z.string().min(1).email(),
    phone: z.string().min(1),
    website: z.string().min(1),
    address: z.string().min(1),
})

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