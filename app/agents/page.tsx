'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heading, Text, Card, Flex, Box, Button, Badge, Table } from '@radix-ui/themes';
import { 
  LuFilter, 
  LuRefreshCw, 
  LuSearch, 
  LuPlus, 
  LuUser, 
  LuUserCheck, 
  LuStar, 
  LuBriefcase, 
  LuMail, 
  LuPhone, 
  LuArrowDownUp 
} from 'react-icons/lu';

// Tipos para os agentes
interface Agent {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  specialty: string;
  experience: string;
  rating: number;
  status: 'active' | 'inactive';
  connections: number;
  lastActivity: string;
}

// Dados mockados para demonstração
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar: '/avatars/agent1.png',
    email: 'carlos.silva@email.com',
    phone: '(11) 98765-4321',
    specialty: 'Agropecuária',
    experience: '5 anos',
    rating: 4.8,
    status: 'active',
    connections: 12,
    lastActivity: '2 horas atrás'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    avatar: '/avatars/agent2.png',
    email: 'maria.oliveira@email.com',
    phone: '(11) 91234-5678',
    specialty: 'Insumos',
    experience: '3 anos',
    rating: 4.5,
    status: 'active',
    connections: 8,
    lastActivity: '1 dia atrás'
  },
  {
    id: '3',
    name: 'Paulo Mendes',
    avatar: '/avatars/agent3.png',
    email: 'paulo.mendes@email.com',
    phone: '(21) 98877-6655',
    specialty: 'Serviços',
    experience: '7 anos',
    rating: 4.9,
    status: 'active',
    connections: 15,
    lastActivity: '5 horas atrás'
  },
  {
    id: '4',
    name: 'Ana Costa',
    avatar: '/avatars/agent4.png',
    email: 'ana.costa@email.com',
    phone: '(11) 97766-5544',
    specialty: 'Equipamentos',
    experience: '2 anos',
    rating: 4.2,
    status: 'inactive',
    connections: 4,
    lastActivity: '3 dias atrás'
  },
  {
    id: '5',
    name: 'Ricardo Nunes',
    avatar: '/avatars/agent5.png',
    email: 'ricardo.nunes@email.com',
    phone: '(15) 98888-7777',
    specialty: 'Agropecuária',
    experience: '8 anos',
    rating: 4.7,
    status: 'active',
    connections: 20,
    lastActivity: '1 hora atrás'
  },
  {
    id: '6',
    name: 'Juliana Martins',
    avatar: '/avatars/agent6.png',
    email: 'juliana.martins@email.com',
    phone: '(31) 96655-4433',
    specialty: 'Serviços',
    experience: '4 anos',
    rating: 4.4,
    status: 'inactive',
    connections: 6,
    lastActivity: '2 dias atrás'
  },
  {
    id: '7',
    name: 'Eduardo Santos',
    avatar: '/avatars/agent7.png',
    email: 'eduardo.santos@email.com',
    phone: '(21) 95544-3322',
    specialty: 'Insumos',
    experience: '6 anos',
    rating: 4.6,
    status: 'active',
    connections: 10,
    lastActivity: '8 horas atrás'
  },
  {
    id: '8',
    name: 'Fernanda Lima',
    avatar: '/avatars/agent8.png',
    email: 'fernanda.lima@email.com',
    phone: '(11) 94433-2211',
    specialty: 'Agropecuária',
    experience: '5 anos',
    rating: 4.5,
    status: 'active',
    connections: 9,
    lastActivity: '12 horas atrás'
  }
];

// Componente para exibir a avaliação em estrelas
const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <Flex gap="1" align="center">
      {[...Array(fullStars)].map((_, i) => (
        <LuStar key={i} className="text-amber-500 fill-amber-500" size={16} />
      ))}
      {hasHalfStar && <LuStar className="text-amber-500 fill-amber-500" size={16} />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <LuStar key={i + fullStars + (hasHalfStar ? 1 : 0)} className="text-gray-300" size={16} />
      ))}
      <Text size="2" className="ml-1">{rating.toFixed(1)}</Text>
    </Flex>
  );
};

// Componente para o status do agente
const StatusBadge = ({ status }: { status: Agent['status'] }) => {
  if (status === 'active') {
    return (
      <Badge color="green" className="flex items-center gap-1">
        <span className="block">Ativo</span>
      </Badge>
    );
  } else {
    return (
      <Badge color="gray" className="flex items-center gap-1">
        <span className="block">Inativo</span>
      </Badge>
    );
  }
};

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(mockAgents);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrar agentes quando o termo de busca ou filtro mudar
  useEffect(() => {
    let results = agents;
    
    // Aplicar filtro de status
    if (filter !== 'all') {
      results = results.filter(agent => agent.status === filter);
    }
    
    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        agent => 
          agent.name.toLowerCase().includes(term) ||
          agent.email.toLowerCase().includes(term) ||
          agent.phone.includes(term) ||
          agent.specialty.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenação por nome
    results = [...results].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
    setFilteredAgents(results);
  }, [agents, searchTerm, filter, sortDirection]);

  // Alternar direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Atualizar filtro
  const handleFilterChange = (newFilter: 'all' | 'active' | 'inactive') => {
    setFilter(newFilter);
  };

  // Abrir modal de contato
  const openContactModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowContactModal(true);
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
        <span>Agentes</span>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Heading size="6" className="text-[#2F855A]">Gerenciamento de Agentes</Heading>
          <Text size="2" color="gray">
            Visualize e gerencie os agentes da plataforma.
          </Text>
        </div>
        
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <LuPlus />
          <span className="block">Novo Agente</span>
        </Button>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-green-100 text-green-600">
              <LuUser size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Agentes Ativos</Text>
              <Text size="6" weight="bold" className="block">
                {agents.filter(a => a.status === 'active').length}
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
              <Text size="2" color="gray" className="block">Total de Conexões</Text>
              <Text size="6" weight="bold" className="block">
                {agents.reduce((total, agent) => total + agent.connections, 0)}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-amber-100 text-amber-600">
              <LuStar size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Avaliação Média</Text>
              <Text size="6" weight="bold" className="block">
                {(agents.reduce((total, agent) => total + agent.rating, 0) / agents.length).toFixed(1)}
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
                Todos
              </Button>
              <Button 
                variant={filter === 'active' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('active')}
                className={filter === 'active' ? 'bg-green-600 text-white' : ''}
              >
                Ativos
              </Button>
              <Button 
                variant={filter === 'inactive' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('inactive')}
                className={filter === 'inactive' ? 'bg-green-600 text-white' : ''}
              >
                Inativos
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
                placeholder="Buscar agentes..."
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
      
      {/* Lista de agentes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Especialidade</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Experiência</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Avaliação</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Conexões</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <Table.Row key={agent.id} className="hover:bg-gray-50">
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                          {agent.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <Text weight="medium">{agent.name}</Text>
                          <Text size="1" color="gray">{agent.email}</Text>
                        </div>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge variant="outline">
                        {agent.specialty}
                      </Badge>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Text size="2">{agent.experience}</Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <RatingStars rating={agent.rating} />
                    </Table.Cell>
                    
                    <Table.Cell>
                      <StatusBadge status={agent.status} />
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <LuBriefcase size={14} className="text-gray-500" />
                        <Text size="2">{agent.connections}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2">
                        <Button size="1" variant="soft">Detalhes</Button>
                        <Button 
                          size="1" 
                          variant="soft" 
                          onClick={() => openContactModal(agent)}
                          className="flex items-center gap-1"
                        >
                          <LuMail size={14} />
                          <span>Contatar</span>
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center py-4">
                    <Text color="gray">Nenhum agente encontrado</Text>
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
          Mostrando {filteredAgents.length} de {agents.length} agentes
        </Text>
        
        <div className="flex space-x-1">
          <Button variant="outline" size="1" disabled>Anterior</Button>
          <Button variant="outline" size="1" className="bg-green-600 text-white">1</Button>
          <Button variant="outline" size="1">2</Button>
          <Button variant="outline" size="1">Próxima</Button>
        </div>
      </div>
      
      {/* Modal de contato (implementação simples) */}
      {showContactModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Heading size="4" className="mb-4">Contatar {selectedAgent.name}</Heading>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <LuMail size={18} className="text-gray-500" />
                <Text>{selectedAgent.email}</Text>
              </div>
              
              <div className="flex items-center gap-2">
                <LuPhone size={18} className="text-gray-500" />
                <Text>{selectedAgent.phone}</Text>
              </div>
              
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2 h-32"
                placeholder="Escreva sua mensagem aqui..."
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowContactModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-green-600 text-white"
                  onClick={() => {
                    alert('Mensagem enviada com sucesso!');
                    setShowContactModal(false);
                  }}
                >
                  Enviar Mensagem
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 