import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Schema específico para a API, sem confirmPassword
const signupApiSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, insira um e-mail válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Dados recebidos para cadastro:', body);
    
    // Validação dos dados de entrada com o schema específico da API
    const validation = signupApiSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Erro de validação:', validation.error.format());
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }
    
    const { name, email, password } = validation.data;
    
    // Verificar se o usuário já existe usando SQL bruto
    const existingUsers = await prisma.$queryRaw`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.log('Usuário já existe:', email);
      return NextResponse.json(
        { error: 'Um usuário com este e-mail já existe.' },
        { status: 409 }
      );
    }
    
    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Gerar UUID
    const idResult = await prisma.$queryRaw`SELECT uuid_generate_v4() as uuid`;
    const id = (idResult as any)[0].uuid;
    
    // Criar usuário usando SQL bruto
    const now = new Date();
    const user = await prisma.$queryRaw`
      INSERT INTO users (id, name, email, "passwordHash", "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${now}, ${now})
      RETURNING id, name, email, "createdAt"
    `;
    
    const newUser = Array.isArray(user) ? user[0] : user;
    console.log('Usuário criado com sucesso:', newUser);
    
    // Retornar dados do usuário (sem a senha)
    return NextResponse.json(
      newUser,
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar o cadastro.', details: String(error) },
      { status: 500 }
    );
  }
} 