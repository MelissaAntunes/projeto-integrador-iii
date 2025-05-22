'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuUser, LuUsers, LuBuilding, LuActivity, LuCalendar, LuInbox, LuCheck } from 'react-icons/lu';
import { Heading, Text, Card, Flex, Box } from '@radix-ui/themes';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

// Componente de métrica
const MetricCard = ({ title, value, icon, color }: MetricCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <Flex align="center" gap="3">
      <Box className={`p-3 rounded-full ${color}`}>
        {icon}
      </Box>
      <Box className="flex flex-col space-y-2">
        <Text size="2" color="gray" weight="medium" className="block">{title}</Text>
        <Text size="6" weight="bold" className="block">{value}</Text>
      </Box>
    </Flex>
  </Card>
);

interface ChartDataItem {
  label: string;
  value: number;
}

// Componente de gráfico de barras simples
const SimpleBarChart = ({ data }: { data: ChartDataItem[] }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="p-4">
      <div className="flex items-end h-[200px] gap-3 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 relative">
            <div className="absolute top-0 transform -translate-y-6 text-center w-full">
              <Text size="2" weight="medium">{item.value}</Text>
            </div>
            <div 
              className="w-full bg-green-500 hover:bg-green-600 transition-colors"
              style={{ 
                height: `${Math.max(30, (item.value / maxValue) * 160)}px`,
                minHeight: '30px',
                borderRadius: '4px 4px 0 0'
              }}
            />
            <div className="text-center w-full pt-2">
              <Text size="2">{item.label}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Activity {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
}

// Componente de tabela de atividades recentes
const RecentActivities = ({ activities }: { activities: Activity[] }) => (
  <div className="mt-6">
    <Heading size="3" className="mb-3">Atividades Recentes</Heading>
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="p-3 bg-white rounded-md border border-gray-100 flex items-start gap-3 hover:shadow-sm transition-shadow">
          <div className={`p-2 rounded-full ${activity.iconBg} text-white shrink-0`}>
            {activity.icon}
          </div>
          <div className="flex flex-col space-y-2">
            <Text weight="medium" className="block">{activity.title}</Text>
            <Text size="2" color="gray" className="block">{activity.time}</Text>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Dados simulados para o gráfico
  const chartData = [
    { label: 'Jan', value: 35 },
    { label: 'Fev', value: 48 },
    { label: 'Mar', value: 42 },
    { label: 'Abr', value: 61 },
    { label: 'Mai', value: 55 },
    { label: 'Jun', value: 70 },
  ];
  
  // Atividades recentes simuladas
  const recentActivities = [
    {
      icon: <LuBuilding size={16} />,
      iconBg: 'bg-blue-500',
      title: 'Nova empresa cadastrada: ABC Agro',
      time: 'Hoje, 14:30'
    },
    {
      icon: <LuCheck size={16} />,
      iconBg: 'bg-green-500',
      title: 'Reunião agendada com Fazenda São João',
      time: 'Hoje, 11:20'
    },
    {
      icon: <LuInbox size={16} />,
      iconBg: 'bg-purple-500',
      title: 'Email enviado para 5 empresas',
      time: 'Ontem, 16:45'
    },
    {
      icon: <LuUser size={16} />,
      iconBg: 'bg-amber-500',
      title: 'Novo agente cadastrado: Carlos Silva',
      time: 'Ontem, 09:15'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-3 py-4">
      <div className="flex flex-col space-y-1 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <span>Dashboard</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Heading size="6" className="text-[#2F855A]">Dashboard</Heading>
            <Text size="2" color="gray">
              Bem-vindo ao painel de controle do AgroMatch. Veja as estatísticas de seu negócio.
            </Text>
          </div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Empresas" 
          value="128" 
          icon={<LuBuilding className="text-white" size={18} />} 
          color="bg-green-500" 
        />
        <MetricCard 
          title="Agentes" 
          value="42" 
          icon={<LuUsers className="text-white" size={18} />} 
          color="bg-blue-500" 
        />
        <MetricCard 
          title="Conexões" 
          value="86" 
          icon={<LuActivity className="text-white" size={18} />} 
          color="bg-amber-500" 
        />
        <MetricCard 
          title="Reuniões Agendadas" 
          value="15" 
          icon={<LuCalendar className="text-white" size={18} />} 
          color="bg-purple-500" 
        />
      </div>

      {/* Acesso Rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Link href="/companies" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-50 text-green-500">
                <LuBuilding size={20} />
              </div>
              <div className="flex flex-col space-y-2">
                <Text weight="medium" className="block">Empresas</Text>
                <Text size="2" color="gray" className="block">Gerenciar empresas</Text>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/agents" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                <LuUsers size={20} />
              </div>
              <div className="flex flex-col space-y-2">
                <Text weight="medium" className="block">Agentes</Text>
                <Text size="2" color="gray" className="block">Gerenciar agentes</Text>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/calendar" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-purple-50 text-purple-500">
                <LuCalendar size={20} />
              </div>
              <div className="flex flex-col space-y-2">
                <Text weight="medium" className="block">Agenda</Text>
                <Text size="2" color="gray" className="block">Ver compromissos</Text>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/documents" className="block">
          <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-amber-50 text-amber-500">
                <LuInbox size={20} />
              </div>
              <div className="flex flex-col space-y-2">
                <Text weight="medium" className="block">Documentos</Text>
                <Text size="2" color="gray" className="block">Acessar documentos</Text>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <Flex justify="between" align="center" py="3" px="4">
            <Heading size="3">Conexões Mensais</Heading>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>2023</span>
            </div>
          </Flex>
          <div className="pt-6">
            <SimpleBarChart data={chartData} />
          </div>
        </Card>
        
        <Card className="h-fit">
          <Box p="4">
            <Heading size="3" mb="3">Distribuição por Tipo</Heading>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <Text>Agropecuária</Text>
                </div>
                <Text weight="medium">48%</Text>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '48%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <Text>Insumos</Text>
                </div>
                <Text weight="medium">32%</Text>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <Text>Serviços</Text>
                </div>
                <Text weight="medium">20%</Text>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </Box>
        </Card>
      </div>
      
      {/* Atividades recentes */}
      <RecentActivities activities={recentActivities} />
    </div>
  );
} 