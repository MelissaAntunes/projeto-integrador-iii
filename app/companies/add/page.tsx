'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heading, Text, Card, Flex, Box, Button } from '@radix-ui/themes';
import { LuBuilding, LuMail, LuPhone, LuGlobe, LuMapPin, LuInfo, LuArrowLeft } from 'react-icons/lu';

export default function AddCompanyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simular envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular atraso na submissão
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirecionar para a lista de empresas
    window.location.href = '/companies';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-3 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/companies" className="hover:text-gray-700">Empresas</Link>
          <span className="mx-2">/</span>
          <span>Adicionar</span>
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <Heading size="6" className="text-[#2F855A]">Adicionar Nova Empresa</Heading>
            <Text size="2" color="gray">
              Preencha os dados abaixo para cadastrar uma nova empresa.
            </Text>
          </div>
          
          <Link href="/companies">
            <Button variant="outline" className="flex items-center gap-1">
              <LuArrowLeft size={16} />
              <span>Voltar</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Formulário centralizado vertical e horizontalmente */}
      <div className="flex-grow flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2F855A] font-medium mb-2">
                <LuBuilding size={18} />
                <Text size="3">Informações básicas</Text>
              </div>
              
              <div className="space-y-4">
                {/* Nome da empresa */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Informe o nome da empresa"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuMail className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="email@empresa.com.br"
                    />
                  </div>
                </div>
                
                {/* Telefone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuPhone className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LuGlobe className="text-gray-400" size={16} />
                    </div>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="https://www.empresa.com.br"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2F855A] font-medium mb-2">
                <LuMapPin size={18} />
                <Text size="3">Endereço</Text>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rua */}
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Rua *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Rua/Avenida"
                  />
                </div>
                
                {/* Número */}
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Número"
                  />
                </div>
                
                {/* Complemento */}
                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complement"
                    name="complement"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Complemento"
                  />
                </div>
                
                {/* Bairro */}
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Bairro"
                  />
                </div>
                
                {/* Cidade */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Cidade"
                  />
                </div>
                
                {/* Estado */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
                
                {/* CEP */}
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
            
            {/* Informações adicionais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#2F855A] font-medium mb-2">
                <LuInfo size={18} />
                <Text size="3">Informações adicionais</Text>
              </div>
              
              <div className="space-y-4">
                {/* Tipo */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Empresa *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione</option>
                    <option value="agropecuaria">Agropecuária</option>
                    <option value="insumos">Insumos</option>
                    <option value="servicos">Serviços</option>
                    <option value="equipamentos">Equipamentos</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Descreva a empresa brevemente"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Text size="1" color="gray" className="mb-6">
                Campos marcados com * são obrigatórios
              </Text>
            </div>
            
            {/* Botões */}
            <div className="flex justify-center gap-4">
              <Link href="/companies">
                <Button variant="outline" className="px-6">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="bg-green-600 text-white px-6" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 