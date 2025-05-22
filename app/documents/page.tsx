'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heading, Text, Card, Flex, Box, Button, Badge, Table } from '@radix-ui/themes';
import { 
  LuFilter, 
  LuRefreshCw, 
  LuSearch, 
  LuPlus, 
  LuFileText, 
  LuFile, 
  LuImage, 
  LuFileSpreadsheet, 
  LuDownload, 
  LuEye, 
  LuArrowDownUp, 
  LuStar,
  LuClock
} from 'react-icons/lu';

// Tipos para documentos
interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'document';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
  starred: boolean;
  url: string;
}

// Dados mockados para demonstração
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Relatório Anual 2023.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedBy: 'Carlos Silva',
    uploadedAt: '10/04/2023',
    category: 'Relatórios',
    starred: true,
    url: '/documents/relatorio-anual-2023.pdf'
  },
  {
    id: '2',
    name: 'Análise de Solo - Fazenda Boa Vista.xlsx',
    type: 'spreadsheet',
    size: '1.8 MB',
    uploadedBy: 'Maria Oliveira',
    uploadedAt: '15/05/2023',
    category: 'Análises',
    starred: false,
    url: '/documents/analise-solo-fazenda.xlsx'
  },
  {
    id: '3',
    name: 'Contrato de Fornecimento.pdf',
    type: 'pdf',
    size: '3.2 MB',
    uploadedBy: 'Paulo Mendes',
    uploadedAt: '22/03/2023',
    category: 'Contratos',
    starred: true,
    url: '/documents/contrato-fornecimento.pdf'
  },
  {
    id: '4',
    name: 'Fotos Equipamentos.jpg',
    type: 'image',
    size: '5.7 MB',
    uploadedBy: 'Ana Costa',
    uploadedAt: '08/06/2023',
    category: 'Imagens',
    starred: false,
    url: '/documents/fotos-equipamentos.jpg'
  },
  {
    id: '5',
    name: 'Cronograma de Plantio 2023.xlsx',
    type: 'spreadsheet',
    size: '1.5 MB',
    uploadedBy: 'Ricardo Nunes',
    uploadedAt: '30/05/2023',
    category: 'Planejamento',
    starred: false,
    url: '/documents/cronograma-plantio.xlsx'
  },
  {
    id: '6',
    name: 'Manual Técnico Equipamentos.pdf',
    type: 'pdf',
    size: '4.3 MB',
    uploadedBy: 'Juliana Martins',
    uploadedAt: '12/06/2023',
    category: 'Manuais',
    starred: false,
    url: '/documents/manual-equipamentos.pdf'
  },
  {
    id: '7',
    name: 'Proposta Comercial.docx',
    type: 'document',
    size: '900 KB',
    uploadedBy: 'Eduardo Santos',
    uploadedAt: '03/04/2023',
    category: 'Propostas',
    starred: true,
    url: '/documents/proposta-comercial.docx'
  },
  {
    id: '8',
    name: 'Certificados Orgânicos.pdf',
    type: 'pdf',
    size: '2.1 MB',
    uploadedBy: 'Fernanda Lima',
    uploadedAt: '18/05/2023',
    category: 'Certificações',
    starred: false,
    url: '/documents/certificados-organicos.pdf'
  }
];

// Componente para ícone do tipo de documento
const DocumentTypeIcon = ({ type }: { type: Document['type'] }) => {
  switch (type) {
    case 'pdf':
      return <LuFile className="text-red-500" size={18} />;
    case 'image':
      return <LuImage className="text-blue-500" size={18} />;
    case 'spreadsheet':
      return <LuFileSpreadsheet className="text-green-600" size={18} />;
    default:
      return <LuFileText className="text-gray-500" size={18} />;
  }
};

export default function DocumentsPage() {
  const [documents] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pdf' | 'spreadsheet' | 'image' | 'document'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtrar documentos quando o termo de busca ou filtro mudar
  useEffect(() => {
    let results = documents;
    
    // Aplicar filtro de tipo
    if (filter !== 'all') {
      results = results.filter(document => document.type === filter);
    }
    
    // Aplicar filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        document => 
          document.name.toLowerCase().includes(term) ||
          document.category.toLowerCase().includes(term) ||
          document.uploadedBy.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenação por nome do documento
    results = [...results].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
    setFilteredDocuments(results);
  }, [documents, searchTerm, filter, sortDirection]);

  // Alternar direção de ordenação
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Atualizar filtro
  const handleFilterChange = (newFilter: 'all' | 'pdf' | 'spreadsheet' | 'image' | 'document') => {
    setFilter(newFilter);
  };

  // Abrir modal de preview
  const openPreview = (document: Document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  // Simular download
  const downloadDocument = (document: Document) => {
    alert(`Baixando ${document.name}...`);
    // Na implementação real, aqui seria o código para iniciar o download
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
        <span>Documentos</span>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <Heading size="6" className="text-[#2F855A]">Gerenciamento de Documentos</Heading>
          <Text size="2" color="gray">
            Visualize, organize e compartilhe documentos importantes.
          </Text>
        </div>
        
        <Button className="bg-green-600 text-white hover:bg-green-700">
          <LuPlus />
          <span className="block">Upload</span>
        </Button>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-gray-100 text-gray-600">
              <LuFileText size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Total de Documentos</Text>
              <Text size="6" weight="bold" className="block">
                {documents.length}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-red-100 text-red-600">
              <LuFile size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">PDFs</Text>
              <Text size="6" weight="bold" className="block">
                {documents.filter(d => d.type === 'pdf').length}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-green-100 text-green-600">
              <LuFileSpreadsheet size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Planilhas</Text>
              <Text size="6" weight="bold" className="block">
                {documents.filter(d => d.type === 'spreadsheet').length}
              </Text>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3" className="p-2">
            <Box className="p-3 rounded-full bg-blue-100 text-blue-600">
              <LuStar size={20} />
            </Box>
            <Box className="flex flex-col space-y-1">
              <Text size="2" color="gray" className="block">Favoritos</Text>
              <Text size="6" weight="bold" className="block">
                {documents.filter(d => d.starred).length}
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
                variant={filter === 'pdf' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('pdf')}
                className={filter === 'pdf' ? 'bg-green-600 text-white' : ''}
              >
                PDF
              </Button>
              <Button 
                variant={filter === 'spreadsheet' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('spreadsheet')}
                className={filter === 'spreadsheet' ? 'bg-green-600 text-white' : ''}
              >
                Planilhas
              </Button>
              <Button 
                variant={filter === 'image' ? 'solid' : 'outline'} 
                onClick={() => handleFilterChange('image')}
                className={filter === 'image' ? 'bg-green-600 text-white' : ''}
              >
                Imagens
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
                placeholder="Buscar documentos..."
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
      
      {/* Lista de documentos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Categoria</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Tamanho</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Enviado por</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Data</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <Table.Row key={document.id} className="hover:bg-gray-50">
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <DocumentTypeIcon type={document.type} />
                        <div className="flex flex-col">
                          <Text weight="medium">{document.name}</Text>
                          <Text size="1" color="gray">{document.type}</Text>
                        </div>
                        {document.starred && (
                          <LuStar className="text-amber-400 fill-amber-400 ml-2" size={16} />
                        )}
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge variant="outline">
                        {document.category}
                      </Badge>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Text size="2">{document.size}</Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Text size="2">{document.uploadedBy}</Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <LuClock size={14} className="text-gray-500" />
                        <Text size="2">{document.uploadedAt}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2">
                        <Button 
                          size="1" 
                          variant="soft"
                          className="flex items-center gap-1"
                          onClick={() => openPreview(document)}
                        >
                          <LuEye size={14} />
                          <span>Visualizar</span>
                        </Button>
                        <Button
                          size="1"
                          variant="soft"
                          className="flex items-center gap-1"
                          onClick={() => downloadDocument(document)}
                        >
                          <LuDownload size={14} />
                          <span>Baixar</span>
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-4">
                    <Text color="gray">Nenhum documento encontrado</Text>
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
          Mostrando {filteredDocuments.length} de {documents.length} documentos
        </Text>
        
        <div className="flex space-x-1">
          <Button variant="outline" size="1" disabled>Anterior</Button>
          <Button variant="outline" size="1" className="bg-green-600 text-white">1</Button>
          <Button variant="outline" size="1">2</Button>
          <Button variant="outline" size="1">Próxima</Button>
        </div>
      </div>
      
      {/* Modal de visualização de documento */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <Heading size="3">{selectedDocument.name}</Heading>
              <Button 
                variant="ghost" 
                onClick={() => setShowPreview(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-4 overflow-auto flex-grow">
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-md">
                <div className="text-center space-y-4">
                  <DocumentTypeIcon type={selectedDocument.type} />
                  <Text size="3" weight="medium">Visualização não disponível</Text>
                  <Text size="2" color="gray">Clique em &quot;Baixar&quot; para abrir o documento em seu dispositivo</Text>
                  <Button 
                    variant="solid" 
                    className="bg-green-600 text-white mt-4"
                    onClick={() => downloadDocument(selectedDocument)}
                  >
                    <LuDownload size={16} />
                    <span className="ml-2">Baixar</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                  <Text size="2">Enviado por {selectedDocument.uploadedBy}</Text>
                  <Text size="2" color="gray">
                    {selectedDocument.uploadedAt} • {selectedDocument.size}
                  </Text>
                </Flex>
                
                <Flex gap="2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreview(false)}
                  >
                    Fechar
                  </Button>
                </Flex>
              </Flex>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 