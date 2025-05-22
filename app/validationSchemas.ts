import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  logo_url: z.string().min(1, "URL do logo é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  website: z.string().min(1, "Website é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um e-mail válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
});

export const signupSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, insira um e-mail válido.',
  }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
  confirmPassword: z.string().min(6, {
    message: 'A confirmação de senha deve ter pelo menos 6 caracteres.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});
