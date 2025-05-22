'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heading, Text, Card, Flex, Box, Button, Badge, Table } from '@radix-ui/themes';
import { LuFilter, LuRefreshCw, LuSearch, LuPlus, LuCheck, LuX, LuClock, LuArrowDownUp, LuUserCheck } from 'react-icons/lu';

// Tipos para as conexões
interface Connection {
  id: string;
  companyName: string;
  companyLogo: string;
  agentName: string;
  agentAvatar: string;
  status: 'active' | 'pending' | 'declined';
  startDate: string;
  lastActivity: string;
  category: string;
}

// Dados mockados para demonstração
const mockConnections: Connection[] = [
  {
    id: '1',
    companyName: 'Fazenda Boa Vista',
    companyLogo: '/logos/company1.png',
    agentName: 'Carlos Silva',
    agentAvatar: '/avatars/agent1.png',
    status: 'active',
    startDate: '10/04/2023',
    lastActivity: '2 horas atrás',
    category: 'Agropecuária'
  },
  {
    id: '2',
    companyName: 'Insumos Agrícolas S/A',
    companyLogo: '/logos/company2.png',
    agentName: 'Maria Oliveira',
    agentAvatar: '/avatars/agent2.png',
    status: 'pending',
    startDate: '15/05/2023',
    lastActivity: '1 dia atrás',
    category: 'Insumos'
  },
  {
    id: '3',
    companyName: 'Agro Sustentável',
    companyLogo: '/logos/company3.png',
    agentName: 'Paulo Mendes',
    agentAvatar: '/avatars/agent3.png',
    status: 'active',
    startDate: '22/03/2023',
    lastActivity: '5 horas atrás',
    category: 'Serviços'
  },
  {
    id: '4',
    companyName: 'Tratores & Máquinas',
    companyLogo: '/logos/company4.png',
    agentName: 'Ana Costa',
    agentAvatar: '/avatars/agent4.png',
    status: 'declined',
    startDate: '08/06/2023',
    lastActivity: '3 dias atrás',
    category: 'Equipamentos'
  },
  {
    id: '5',
    companyName: 'Orgânicos do Vale',
    companyLogo: '/logos/company5.png',
    agentName: 'Ricardo Nunes',
    agentAvatar: '/avatars/agent5.png',
    status: 'active',
    startDate: '30/05/2023',
    lastActivity: '1 hora atrás',
    category: 'Agropecuária'
  },
  {
    id: '6',
    companyName: 'AgroPlan Consultoria',
    companyLogo: '/logos/company6.png',
    agentName: 'Juliana Martins',
    agentAvatar: '/avatars/agent6.png',
    status: 'pending',
    startDate: '12/06/2023',
    lastActivity: '2 dias atrás',
    category: 'Serviços'
  },
  {
    id: '7',
    companyName: 'Sementes Premium',
    companyLogo: '/logos/company7.png',
    agentName: 'Eduardo Santos',
    agentAvatar: '/avatars/agent7.png',
    status: 'active',
    startDate: '03/04/2023',
    lastActivity: '8 horas atrás',
    category: 'Insumos'
  },
  {
    id: '8',
    companyName: 'Laticínios Serra Azul',
    companyLogo: '/logos/company8.png',
    agentName: 'Fernanda Lima',
    agentAvatar: '/avatars/agent8.png',
    status: 'active',
    startDate: '18/05/2023',
    lastActivity: '12 horas atrás',
    category: 'Agropecuária'
  }
];

// Componente que exibe o status da conexão
const StatusBadge = ({ status }: { status: Connection['status'] }) => {
  if (status === 'active') {
    return (
      <Badge color="green" className="flex items-center gap-1">
        <LuCheck size={14} />
        <span className="block">Ativa</span>
      </Badge>
    );
  } else if (status === 'pending') {
    return (
      <Badge color="amber" className="flex items-center gap-1">
        <LuClock size={14} />
        <span className="block">Pendente</span>
      </Badge>
    );
  } else {
    return (
      <Badge color="red" className="flex items-center gap-1">
        <LuX size={14} />
        <span className="block">Recusada</span>
      </Badge>
    );
  }
};

export default function ConnectionsPage() {
  const [connections] = useState<Connection[]>(mockConnections);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>(mockConnections);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'declined'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrar conexões quando o termo de busca ou filtro mudar
  useEffect(() => {
    let results = connections;
    
    // Aplicar filtro de status
    if (filter !== 'all') {
      results = results.filter(connection => connection.status === filter);
    }
    
    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        connection => 
          connection.companyName.toLowerCase().includes(term) ||
          connection.agentName.toLowerCase().includes(term) ||
          connection.category.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenação por nome da empresa
    results = [...results].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.companyName.localeCompare(b.companyName);
      } else {
        return b.companyName.localeCompare(a.companyName);
      }
    });
    
    setFilteredConnections(results);
  }, [connections, searchTerm, filter, sortDirection]);

  // Alternar direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Atualizar filtro
  const handleFilterChange = (newFilter: 'all' | 'active' | 'pending' | 'declined') => {
    setFilter(newFilter);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 py-4">
      <div className="flex items-center text-sm text-gray-500 mb-1">
        <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">/</span>
        <span>Conexões</span>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Heading size="6" className="text-[#2F855A]">Gerenciamento de Conexões</Heading>
          <Text size="2" color="gray">
            Visualize e gerencie as conexões entre empresas e agentes.
          </Text>
        </div>
        
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <LuPlus />
          <span className="block">Nova Conexão</span>
        </Button>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-green-100 text-green-600">
              <LuCheck size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Conexões Ativas</Text>
              <Text size="6" weight="bold" className="block">
                {connections.filter(c => c.status === 'active').length}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-amber-100 text-amber-600">
              <LuClock size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Pendentes</Text>
              <Text size="6" weight="bold" className="block">
                {connections.filter(c => c.status === 'pending').length}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-blue-100 text-blue-600">
              <LuUserCheck size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Taxa de Aceitação</Text>
              <Text size="6" weight="bold" className="block">
                {Math.round((connections.filter(c => c.status === 'active').length / connections.length) * 100)}%
              </Text>
            </Box>
          </Flex>
        </Card>
      </div>
      
      {/* Filtros e busca */}
      <Card className="p-4">
        <Flex justify="between" wrap="wrap" gap="4">
          <Flex align="center" gap="3">
            <Box className="p-2 rounded-md bg-gray-100">
              <LuFilter size={18} className="text-gray-500" />
            </Box>
            
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('all')}
                className={filter === 'all' ? 'bg-green-600 text-white' : ''}
              >
                Todas
              </Button>
              <Button 
                variant={filter === 'active' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('active')}
                className={filter === 'active' ? 'bg-green-600 text-white' : ''}
              >
                Ativas
              </Button>
              <Button 
                variant={filter === 'pending' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('pending')}
                className={filter === 'pending' ? 'bg-green-600 text-white' : ''}
              >
                Pendentes
              </Button>
              <Button 
                variant={filter === 'declined' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('declined')}
                className={filter === 'declined' ? 'bg-green-600 text-white' : ''}
              >
                Recusadas
              </Button>
            </div>
          </Flex>
          
          <Flex align="center" gap="2">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Buscar conexões..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" onClick={toggleSortDirection}>
              <LuArrowDownUp />
              <span className="block">
                {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
              </span>
            </Button>
            
            <Button variant="outline">
              <LuRefreshCw />
            </Button>
          </Flex>
        </Flex>
      </Card>
      
      {/* Lista de conexões */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Empresa</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Agente</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Categoria</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Data Início</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Última Atividade</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <Table.Row key={connection.id} className="hover:bg-gray-50">
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                          {connection.companyName.charAt(0)}
                        </div>
                        <Text weight="medium">{connection.companyName}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                          {connection.agentName.charAt(0)}
                        </div>
                        <Text>{connection.agentName}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge variant="outline">
                        {connection.category}
                      </Badge>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Text size="2">{connection.startDate}</Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <StatusBadge status={connection.status} />
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Text size="2" color="gray">{connection.lastActivity}</Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2">
                        <Button size="1" variant="soft">Detalhes</Button>
                        {connection.status === 'pending' && (
                          <Button size="1" className="bg-green-600 text-white">Aprovar</Button>
                        )}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-4">
                    <Text color="gray">Nenhuma conexão encontrada</Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
      
      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <Text size="2" color="gray">
          Mostrando {filteredConnections.length} de {connections.length} conexões
        </Text>
        
        <div className="flex space-x-1">
          <Button variant="outline" size="1" disabled>Anterior</Button>
          <Button variant="outline" size="1" className="bg-green-600 text-white">1</Button>
          <Button variant="outline" size="1">2</Button>
          <Button variant="outline" size="1">Próxima</Button>
        </div>
      </div>
    </div>
  );
} 