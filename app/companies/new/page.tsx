"use client";
import { useState } from 'react';
import { TextField, Button, TextArea, Callout, Text } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons';
import "easymde/dist/easymde.min.css"
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCompanySchema } from '@/app/validationSchemas';
import { z } from 'zod';

type CompanyForm = z.infer<typeof createCompanySchema>;

const NewCompanyPage = () => {
    const router = useRouter();
    const {register, control, handleSubmit, formState: { errors }} = useForm<CompanyForm>({
        resolver: zodResolver(createCompanySchema)
    });
    const [error, setError] = useState('');

  return (
    <div className='max-w-xl '> 
        {error && <Callout.Root color="red" className='mb-5'>
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{error}</Callout.Text>
                    </Callout.Root>}

    <form className='space-y-4' 
    onSubmit={handleSubmit(async (data) => {
        try {
            await axios.post('/api/companies', data);
            router.push('/companies');
        } catch {
            setError('Error adding a company');
        }
        
    })}>
        <TextField.Root placeholder="Name" {...register('name')} />
         {errors.name && <Text color="red" as='p' size="1">{errors.name.message}</Text>}
        <TextField.Root placeholder="Logo URL" {...register('logo_url')} />
        <TextField.Root placeholder="Email" {...register('email')} />
        <TextField.Root placeholder="Phone" {...register('phone')} />
        <TextField.Root placeholder="Website" {...register('website')} />
        <TextField.Root placeholder="Address" {...register('address')} />
        
        <Controller
            name="description"
            control={control}
            render={({ field }) => <TextArea placeholder="Description" {...field}/>}
        />
        {errors.description && <Text color="red" as='p' size="1">{errors.description.message}</Text>}

        <Button>Add new company</Button>
    </form>
    </div>
  )
}

export default NewCompanyPage