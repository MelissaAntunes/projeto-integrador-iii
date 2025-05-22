'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { LuSearch, LuPlus, LuChevronLeft, LuChevronRight, LuMail, LuX, LuArrowDown, LuArrowUp } from 'react-icons/lu';
import CompanyCard from '../components/CompanyCard';
import axios from 'axios';
import { Flex, Heading, Text, Badge, Dialog, Button, TextArea, TextField } from '@radix-ui/themes';

interface Company {
  id: string;
  name: string;
  logo_url: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState({ success: false, message: '' });
  
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 8
  });

  const fetchCompanies = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/companies?page=${page}&limit=${pagination.limit}`);
      setCompanies(data.companies);
      setPagination(data.pagination);
      setError('');
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Não foi possível carregar as empresas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(pagination.currentPage);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchCompanies(newPage);
  };

  // Função para alternar a ordem de classificação
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  // Primeiro filtramos as empresas com base no termo de pesquisa
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  // Depois ordenamos as empresas filtradas
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }, [filteredCompanies, sortOrder]);

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust startPage if we're near the end
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const toggleCompanySelection = (company: Company) => {
    if (selectedCompanies.some(c => c.id === company.id)) {
      setSelectedCompanies(selectedCompanies.filter(c => c.id !== company.id));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };
  
  const openEmailDialog = () => {
    if (selectedCompanies.length === 0) {
      alert('Por favor, selecione pelo menos uma empresa para enviar email.');
      return;
    }
    setIsEmailDialogOpen(true);
  };
  
  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      alert('Por favor, preencha o assunto e o corpo do email.');
      return;
    }
    
    try {
      setIsSendingEmail(true);
      
      // Preparar os dados para envio
      const emailData = {
        to: selectedCompanies.map(company => ({ 
          email: company.email, 
          name: company.name 
        })),
        subject: emailSubject,
        body: emailBody
      };
      
      // Enviar para a API
      const response = await axios.post('/api/email/send', emailData);
      
      // Resposta de sucesso
      setEmailResult({
        success: true,
        message: `Email enviado com sucesso para ${selectedCompanies.length} empresas!`
      });
      
      // Limpar formulário depois de 3 segundos
      setTimeout(() => {
        setIsEmailDialogOpen(false);
        setEmailSubject('');
        setEmailBody('');
        setSelectedCompanies([]);
        setEmailResult({ success: false, message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setEmailResult({
        success: false,
        message: 'Erro ao enviar email. Por favor, tente novamente.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8 px-2">
      <div className="flex flex-col space-y-1 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/companies" className="hover:text-gray-700">Empresas</Link>
          <span className="mx-2">/</span>
          <span>Todas</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <Heading size="6" className="text-[#2F855A]">Empresas</Heading>
            <Text size="2" color="gray">
              Acesse a lista de empresas para visualizar, editar ou adicionar novos contatos!
            </Text>
          </div>
          
          <Link
            href="/companies/new"
            className="inline-flex items-center gap-2 bg-[#2F855A] hover:bg-[#1B5E20] text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <LuPlus size={18} />
            <span>Adicionar Empresa</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LuSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone, website ou endereço..."
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tipo:</span>
          <select className="border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]">
            <option value="">Todos</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="text-sm font-medium text-[#2F855A] border border-[#2F855A] px-3 py-1.5 rounded hover:bg-[#E8F5E9] transition-colors flex items-center gap-1"
            onClick={toggleSortOrder}
          >
            {sortOrder === 'asc' ? (
              <>AZ <LuArrowDown size={14} /></>
            ) : (
              <>ZA <LuArrowUp size={14} /></>
            )}
          </button>
          <button 
            className="bg-[#2F855A] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#1B5E20] transition-colors flex items-center gap-1"
            onClick={openEmailDialog}
          >
            <LuMail size={16} />
            <span>Enviar Email</span>
          </button>
        </div>
      </div>
      
      {selectedCompanies.length > 0 && (
        <div className="bg-[#E8F5E9] p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <Text size="2" weight="medium">Empresas selecionadas: {selectedCompanies.length}</Text>
            <button 
              className="text-[#2F855A] text-xs hover:underline"
              onClick={() => setSelectedCompanies([])}
            >
              Limpar seleção
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCompanies.map(company => (
              <div key={company.id} className="bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs text-[#2F855A] border border-[#C8E6C9]">
                <span>{company.name}</span>
                <button
                  onClick={() => toggleCompanySelection(company)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <LuX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
          {error}
        </div>
      ) : sortedCompanies.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <Text size="5" className="text-gray-500 mb-4">Nenhuma empresa encontrada</Text>
          <Link
            href="/companies/new"
            className="inline-flex items-center gap-2 bg-[#2F855A] hover:bg-[#1B5E20] text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <LuPlus size={18} />
            <span>Adicionar sua primeira empresa</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedCompanies.map(company => (
              <div key={company.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <input 
                    type="checkbox" 
                    checked={selectedCompanies.some(c => c.id === company.id)}
                    onChange={() => toggleCompanySelection(company)}
                    className="h-4 w-4 accent-[#2F855A] rounded"
                  />
                </div>
                <CompanyCard
                  id={company.id}
                  name={company.name}
                  logo_url={company.logo_url}
                  email={company.email}
                  phone={company.phone}
                  website={company.website}
                  address={company.address}
                />
              </div>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                    pagination.currentPage === 1 
                      ? 'text-gray-400 border-gray-200' 
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs">1</span>
                </button>
                
                {getPageNumbers().slice(1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                      pageNumber === pagination.currentPage
                        ? 'bg-[#E8F5E9] text-[#2F855A] border-[#C8E6C9]'
                        : 'text-gray-500 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs">{pageNumber}</span>
                  </button>
                ))}
                
                {pagination.totalPages > 5 && (
                  <>
                    <span className="w-7 text-center text-gray-400">•••</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                        pagination.currentPage === pagination.totalPages
                          ? 'bg-[#E8F5E9] text-[#2F855A] border-[#C8E6C9]'
                          : 'text-gray-500 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs">{pagination.totalPages}</span>
                    </button>
                  </>
                )}
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`w-7 h-7 flex items-center justify-center rounded-full border ${
                    pagination.currentPage === pagination.totalPages 
                      ? 'text-gray-400 border-gray-200' 
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs">&gt;</span>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      
      {/* Modal de Envio de Email */}
      <Dialog.Root open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <Dialog.Content style={{ maxWidth: 550 }}>
          <Dialog.Title>Enviar Email</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Enviar email para {selectedCompanies.length} empresas selecionadas
          </Dialog.Description>

          <div className="mb-4">
            <div className="text-sm font-medium mb-1">Destinatários:</div>
            <div className="flex flex-wrap gap-1 p-2 border border-gray-200 rounded-md mb-4 max-h-20 overflow-y-auto">
              {selectedCompanies.map(company => (
                <div key={company.id} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {company.name} ({company.email})
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Assunto:</label>
              <TextField.Root 
                id="subject"
                placeholder="Digite o assunto do email" 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium mb-1">Mensagem:</label>
              <TextArea
                id="body"
                placeholder="Digite a mensagem do email"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                style={{ minHeight: 120 }}
              />
            </div>
          </div>
          
          {emailResult.message && (
            <div className={`p-2 rounded-md mb-4 text-sm ${
              emailResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {emailResult.message}
            </div>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close asChild>
              <Button variant="soft" color="gray">
                Cancelar
              </Button>
            </Dialog.Close>
            <Button 
              onClick={handleSendEmail} 
              disabled={isSendingEmail || !emailSubject || !emailBody}
              className="bg-[#2F855A] hover:bg-[#1B5E20] text-white"
            >
              {isSendingEmail ? 'Enviando...' : 'Enviar Email'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default CompaniesPage;