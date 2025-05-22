"use client";
import { useState } from 'react';
import { TextField, Button, TextArea, Callout, Select } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons';
import "easymde/dist/easymde.min.css"
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type CompanyForm = z.infer<typeof createCompanySchema>;

const NewCompanyPage = () => {
    const router = useRouter();
    const {register, control, handleSubmit, formState: { errors }} = useForm<CompanyForm>({
        resolver: zodResolver(createCompanySchema)
    });
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    
    const onSubmit = handleSubmit(async (data) => {
        try {
            setSubmitting(true);
            console.log('Enviando dados:', data);
            const response = await axios.post('/api/companies', data);
            console.log('Resposta:', response.data);
            router.push('/companies');
        } catch (error) {
            setSubmitting(false);
            console.error('Erro detalhado:', error);
            
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;
                
                setError(`Erro (${statusCode}): ${JSON.stringify(errorData)}`);
            } else {
                setError('Erro ao adicionar empresa. Verifique o console para mais detalhes.');
            }
        }
    });
        

  return (
    <div className='min-h-screen flex items-center justify-center px-4'> 
        <div className='max-w-xl w-full bg-white p-6 rounded-lg shadow-sm'>
            {error && <Callout.Root color="red" className='mb-5'>
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>{error}</Callout.Text>
                        </Callout.Root>}

            <form className='space-y-4' onSubmit={onSubmit}>
                <h2 className="text-2xl font-semibold text-[#2F855A] mb-4">Adicionar Nova Empresa</h2>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                    <TextField.Root placeholder="Ex: Tech Agrícola S.A." {...register('name')} />
                    <ErrorMessage>{errors.name?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                    <TextField.Root placeholder="Ex: https://example.com/logo.png" {...register('logo_url')} />
                    <ErrorMessage>{errors.logo_url?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <TextField.Root placeholder="Ex: contato@empresa.com.br" {...register('email')} />
                    <ErrorMessage>{errors.email?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <TextField.Root placeholder="Ex: (11) 98765-4321" {...register('phone')} />
                    <ErrorMessage>{errors.phone?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <TextField.Root placeholder="Ex: https://www.empresa.com.br" {...register('website')} />
                    <ErrorMessage>{errors.website?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <TextField.Root placeholder="Ex: Rua das Palmeiras, 123, Centro - São Paulo/SP" {...register('address')} />
                    <ErrorMessage>{errors.address?.message}</ErrorMessage>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <TextArea placeholder="Ex: Empresa especializada em tecnologia para o setor agrícola..." {...field}/>}
                    />
                    <ErrorMessage>{errors.description?.message}</ErrorMessage>
                </div>

                <div className="flex justify-center mt-6">
                    <Button disabled={isSubmitting} className="px-6 py-2">
                        {isSubmitting ? 'Adicionando...' : 'Adicionar empresa'}
                        {isSubmitting && <Spinner />}
                    </Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default NewCompanyPage