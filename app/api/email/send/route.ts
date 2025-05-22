import { NextRequest, NextResponse } from "next/server";

// Simulação de envio de email - em um ambiente real você usaria
// um serviço de email como SendGrid, Mailgun, Amazon SES, etc.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, body: emailBody } = body;
    
    // Validação dos dados
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { error: "Destinatários inválidos" },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Assunto é obrigatório" },
        { status: 400 }
      );
    }

    if (!emailBody) {
      return NextResponse.json(
        { error: "Corpo do email é obrigatório" },
        { status: 400 }
      );
    }
    
    // Em um ambiente real, você enviaria o email aqui
    // Mas como é uma simulação, vamos apenas fazer um console.log
    console.log("Enviando email:");
    console.log("Para:", to.map(recipient => `${recipient.name} <${recipient.email}>`).join(", "));
    console.log("Assunto:", subject);
    console.log("Mensagem:", emailBody);
    
    // Simular uma pequena espera para dar impressão de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: `Email enviado com sucesso para ${to.length} destinatários`
    });
    
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Falha ao enviar email", details: String(error) },
      { status: 500 }
    );
  }
} 