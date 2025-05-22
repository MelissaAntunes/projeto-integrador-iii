import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import bcrypt from 'bcrypt';
import { loginSchema } from '@/app/validationSchemas';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Dados recebidos para login:', { email: body.email });
    
    // Validar dados de entrada
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('Erro de validação:', validation.error.format());
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }
    
    const { email, password } = validation.data;
    
    // Verificar se o usuário existe usando SQL bruto
    const users = await prisma.$queryRaw`
      SELECT id, name, email, "passwordHash" FROM users WHERE email = ${email} LIMIT 1
    `;
    
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
    
    if (!user) {
      console.log('Usuário não encontrado:', email);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      console.log('Senha incorreta para:', email);
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    console.log('Login bem-sucedido para:', email);
    
    // Criar token JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Resposta com dados do usuário e token
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      }
    );
    
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar o login.', details: String(error) },
      { status: 500 }
    );
  }
} 