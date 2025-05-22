"use client";

import { useState, useEffect } from 'react';
import { TextField, Button, TextArea, Callout, Heading, Select } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import Link from 'next/link';
import { LuArrowLeft } from 'react-icons/lu';

type CompanyForm = z.infer<typeof createCompanySchema>;

const EditCompanyPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm<CompanyForm>({
        resolver: zodResolver(createCompanySchema)
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/api/companies/${id}`);
                console.log('Dados recebidos da API:', data);
                
                // Preencher o formulário com os dados existentes
                reset({
                    name: data.name,
                    logo_url: data.logo_url,
                    description: data.description,
                    email: data.email,
                    phone: data.phone,
                    website: data.website,
                    address: data.address
                });
                setError('');
            } catch (error) {
                console.error('Error fetching company:', error);
                setError('Não foi possível carregar os dados da empresa.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCompany();
    }, [id, reset]);
    
    const onSubmit = handleSubmit(async (data) => {
        try {
            setSubmitting(true);
            console.log('Enviando dados para atualização:', data);
            
            const response = await axios.patch(`/api/companies/${id}`, data);
            console.log('Resposta da atualização:', response.data);
            
            router.push(`/companies/${id}`);
        } catch (error) {
            setSubmitting(false);
            console.error('Error updating company:', error);
            
            // Mensagem de erro mais detalhada
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
                
                if (statusCode === 400) {
                    setError(`Erro de validação: ${JSON.stringify(errorData)}`);
                } else if (statusCode === 404) {
                    setError('Empresa não encontrada.');
                } else if (statusCode === 500) {
                    setError(`Erro interno do servidor: ${JSON.stringify(errorData)}`);
                } else {
                    setError(`Erro desconhecido (${statusCode}): ${JSON.stringify(errorData)}`);
                }
            } else {
                setError('Erro ao atualizar a empresa. Verifique o console para mais detalhes.');
            }
        }
    });
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/companies" className="hover:text-gray-700">Empresas</Link>
                <span className="mx-2">/</span>
                <Link href={`/companies/${id}`} className="hover:text-gray-700">Detalhes</Link>
                <span className="mx-2">/</span>
                <span>Editar</span>
            </div>
            
            <div className="flex justify-between items-center mb-6">
                <Heading size="6" className="text-[#2F855A]">Editar Empresa</Heading>
                <Link
                    href={`/companies/${id}`}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md transition-colors"
                >
                    <LuArrowLeft size={16} />
                    <span>Voltar</span>
                </Link>
            </div>
            
            <div className='max-w-xl'> 
                {error && (
                    <Callout.Root color="red" className='mb-5'>
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{error}</Callout.Text>
                    </Callout.Root>
                )}

                <form className='space-y-4' onSubmit={onSubmit}>
                    <TextField.Root placeholder="Name" {...register('name')} />
                    <ErrorMessage>{errors.name?.message}</ErrorMessage>
                    
                    <TextField.Root placeholder="Logo URL" {...register('logo_url')} />
                    <ErrorMessage>{errors.logo_url?.message}</ErrorMessage>
                    
                    <TextField.Root placeholder="Email" {...register('email')} />
                    <ErrorMessage>{errors.email?.message}</ErrorMessage>
                    
                    <TextField.Root placeholder="Phone" {...register('phone')} />
                    <ErrorMessage>{errors.phone?.message}</ErrorMessage>
                    
                    <TextField.Root placeholder="Website" {...register('website')} />
                    <ErrorMessage>{errors.website?.message}</ErrorMessage>
                    
                    <TextField.Root placeholder="Address" {...register('address')} />
                    <ErrorMessage>{errors.address?.message}</ErrorMessage>
                    
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <TextArea placeholder="Description" {...field} />}
                    />
                    <ErrorMessage>{errors.description?.message}</ErrorMessage>

                    <Button disabled={isSubmitting} className="bg-[#2F855A]">
                        {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                        {isSubmitting && <Spinner />}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyPage; 