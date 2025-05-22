'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuEyeOff, LuMail, LuLock, LuUser } from 'react-icons/lu';
import { BiErrorCircle } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';
import { signupSchema } from '../validationSchemas';
import { z } from 'zod';
import axios from 'axios';

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      console.log('Enviando dados:', { name: data.name, email: data.email, password: data.password });
      
      // Enviar dados para a API
      const response = await axios.post('/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      console.log('Resposta da API:', response.data);
      
      setSuccessMessage('Conta criada com sucesso! Redirecionando para o login...');
      
      // Redirecionar para a página de login após 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      if (error.response?.data?.error) {
        if (typeof error.response.data.error === 'string') {
          setErrorMessage(error.response.data.error);
        } else {
          // Para erros de validação formatados
          setErrorMessage('Erro de validação dos dados. Verifique os campos e tente novamente.');
          console.error('Detalhes do erro:', JSON.stringify(error.response.data.error, null, 2));
        }
      } else {
        setErrorMessage(`Ocorreu um erro ao criar sua conta: ${error.message || 'Erro desconhecido'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2F855A] tracking-tight">Criar Conta</h1>
          <p className="mt-2 text-sm text-[#4CAF50]">
            Preencha os dados abaixo para se cadastrar no AgroMatch
          </p>
        </div>
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <BiErrorCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
            <FaCheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-[#2F855A]">
              Nome
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuUser className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <input
                id="name"
                type="text"
                {...form.register('name')}
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#2F855A]">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuMail className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <input
                id="email"
                type="email"
                {...form.register('email')}
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#2F855A]">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuLock className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
                className="block w-full pl-10 pr-10 py-2 rounded-md border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="******"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <LuEyeOff className="h-5 w-5 text-[#4CAF50]" />
                ) : (
                  <LuEye className="h-5 w-5 text-[#4CAF50]" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2F855A]">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuLock className="h-5 w-5 text-[#4CAF50]" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...form.register('confirmPassword')}
                className="block w-full pl-10 pr-10 py-2 rounded-md border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                placeholder="******"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <LuEyeOff className="h-5 w-5 text-[#4CAF50]" />
                ) : (
                  <LuEye className="h-5 w-5 text-[#4CAF50]" />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#2F855A] hover:bg-[#1B5E20] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-colors flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/" className="font-medium text-[#2F855A] hover:text-[#1B5E20] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 