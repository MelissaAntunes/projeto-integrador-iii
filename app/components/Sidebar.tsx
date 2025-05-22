'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaChartPie, FaBuilding, FaFileAlt } from 'react-icons/fa';
import classNames from 'classnames';
import { SidebarContext } from '../layout';

const Sidebar = () => {
  const currentPath = usePathname();
  const { isOpen } = useContext(SidebarContext);
  
  // Não mostrar a barra lateral nas páginas de login e registro
  const isAuthPage = currentPath === '/' || currentPath === '/signup';
  if (isAuthPage) {
    return null;
  }

  const links = [
    { label: 'Home', href: '/dashboard', icon: <FaHome /> },
    { label: 'Agentes', href: '/agents', icon: <FaUsers /> },
    { label: 'Conexões', href: '/connections', icon: <FaChartPie /> },
    { label: 'Empresas', href: '/companies', icon: <FaBuilding /> },
    { label: 'Documentos', href: '/documents', icon: <FaFileAlt /> },
  ];

  return (
    <div 
      id="sidebar" 
      className={`bg-gray-100 min-h-screen w-[72px] fixed left-0 top-14 flex flex-col items-center pt-6 ${isOpen ? '' : 'hidden'}`} 
      role="navigation"
    >
      <div className="flex flex-col items-center space-y-6">
        {links.map(link => (
          <Link 
            key={link.href} 
            href={link.href}
            className={classNames({
              'flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-colors': true,
              'bg-white text-[#2F855A]': link.href === currentPath,
              'text-gray-500 hover:text-[#2F855A] hover:bg-white/60': link.href !== currentPath,
            })}
          >
            <div className="flex flex-col items-center">
              <span className="h-4 w-4">{link.icon}</span>
              <span className="text-[10px] mt-1">{link.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 