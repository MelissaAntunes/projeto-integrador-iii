'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuEyeOff, LuMail, LuLock } from 'react-icons/lu';
import { BiErrorCircle } from 'react-icons/bi';
import { loginSchema } from './validationSchemas';
import { z } from 'zod';
import axios from 'axios';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Enviar dados para a API
      const response = await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      
      // Salvar token em localStorage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirecionar para a página de dashboard
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2F855A] tracking-tight">Entrar</h1>
          <p className="mt-2 text-sm text-[#4CAF50]">
            Acesse sua conta no AgroMatch
          </p>
        </div>
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <BiErrorCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-[#A5D6A7] rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-[#2F855A] hover:text-[#1B5E20]">
                Esqueceu a senha?
              </a>
            </div>
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
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/signup" className="font-medium text-[#2F855A] hover:text-[#1B5E20] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}