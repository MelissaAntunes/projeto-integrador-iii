'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Heading, Text, Card, Box, Flex } from '@radix-ui/themes';
import { LuBuilding, LuMail, LuPhone, LuGlobe, LuMapPin, LuArrowLeft, LuPenLine } from 'react-icons/lu';

interface Company {
  id: string;
  name: string;
  logo_url: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  description: string;
  createdAt?: string;
}

const CompanyDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/companies/${id}`);
        setCompany(data);
        setError('');
      } catch (error) {
        console.error('Error fetching company details:', error);
        setError('Não foi possível carregar os detalhes da empresa. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <Text size="5" className="text-gray-500 mb-4">Empresa não encontrada</Text>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 bg-[#2F855A] hover:bg-[#1B5E20] text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <LuArrowLeft size={18} />
          <span>Voltar para lista de empresas</span>
        </Link>
      </div>
    );
  }

  const logoContainerStyle = {
    border: '1px solid #f2f2f2',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '160px',
    background: 'white'
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/companies" className="hover:text-gray-700">Empresas</Link>
        <span className="mx-2">/</span>
        <span>{company.name}</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <Heading size="6" className="text-[#2F855A]">Detalhes da Empresa</Heading>
        <div className="flex gap-2">
          <Link
            href={`/companies/${id}/edit`}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <LuPenLine size={16} />
            <span>Editar</span>
          </Link>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <LuArrowLeft size={16} />
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <Flex gap="6" direction={{ initial: 'column', sm: 'row' }}>
        {/* Left Side - Logo and Basic Info */}
        <Box className="w-full sm:w-1/3">
          <Card size="3" className="shadow-sm w-full">
            <Flex direction="column" gap="4" align="center">
              <div className="w-full" style={logoContainerStyle}>
                {company.logo_url && !imgError ? (
                  <img 
                    src={company.logo_url}
                    alt={`${company.name} Logo`}
                    className="max-h-32 max-w-full object-contain"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <LuBuilding className="text-gray-400 text-5xl" />
                  </div>
                )}
              </div>
              <Heading size="4" className="text-center">{company.name}</Heading>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                Sem Categoria Estabelecida
              </div>
            </Flex>
            
            <div className="mt-6 space-y-3">
              {company.email && (
                <Flex align="center" gap="2">
                  <LuMail className="text-[#4CAF50]" />
                  <Text size="2"><a href={`mailto:${company.email}`} className="hover:underline">{company.email}</a></Text>
                </Flex>
              )}
              
              {company.phone && (
                <Flex align="center" gap="2">
                  <LuPhone className="text-[#4CAF50]" />
                  <Text size="2"><a href={`tel:${company.phone}`} className="hover:underline">{company.phone}</a></Text>
                </Flex>
              )}
              
              {company.website && (
                <Flex align="center" gap="2">
                  <LuGlobe className="text-[#4CAF50]" />
                  <Text size="2" className="truncate">
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </Text>
                </Flex>
              )}
              
              {company.address && (
                <Flex align="center" gap="2">
                  <LuMapPin className="text-[#4CAF50]" />
                  <Text size="2">{company.address}</Text>
                </Flex>
              )}
            </div>
          </Card>
        </Box>
        
        {/* Right Side - Description and Additional Info */}
        <Box className="w-full sm:w-2/3">
          <Card size="3" className="shadow-sm w-full">
            <Heading size="3" className="mb-4">Sobre a Empresa</Heading>
            <Text className="whitespace-pre-line">
              {company.description || 'Nenhuma descrição fornecida para esta empresa.'}
            </Text>
            
            <div className="mt-8">
              <Heading size="3" className="mb-4">Informações Adicionais</Heading>
              <div className="space-y-2">
                <Flex justify="between">
                  <Text size="2" color="gray">Data de Cadastro:</Text>
                  <Text size="2">
                    {company.createdAt 
                      ? new Date(company.createdAt).toLocaleDateString('pt-BR') 
                      : 'Não disponível'}
                  </Text>
                </Flex>
              </div>
            </div>
          </Card>
        </Box>
      </Flex>
    </div>
  );
};

export default CompanyDetailsPage; 