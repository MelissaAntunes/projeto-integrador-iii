'use client'
import React, { useState, useRef, useEffect, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LuLeafyGreen, LuMenu, LuBell, LuSettings, LuLogOut, LuUser, LuEye, LuEyeOff } from "react-icons/lu";
import { SidebarContext, ContrastContext } from './layout';

const NavBar = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const isAuthPage = currentPath === '/' || currentPath === '/signup';
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { toggle } = useContext(SidebarContext);
    const { highContrast, toggleContrast } = useContext(ContrastContext);

    useEffect(() => {
      // Fechar o menu quando clicar fora dele
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleLogout = () => {
      // Remover dados de autenticação
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      // Redirecionar para a página de login
      router.push('/');
      setShowMenu(false);
    };

    // Se for página de autenticação, mostra apenas o logo
    if (isAuthPage) {
      return (
        <div className="flex justify-center py-4">
          <Link href="/" className='flex items-center space-x-2'>
            <LuLeafyGreen className="text-[#2F855A] h-8 w-8" />
            <span className="font-bold text-[#2F855A] text-xl">AgroMatch</span>
          </Link>
        </div>
      );
    }

    return (
      <nav className="bg-gray-100 fixed top-0 left-0 right-0 z-10 h-14">
        <div className="flex items-center h-full">
          <div className="w-[72px] h-full flex items-center justify-center">
            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            >
              <LuMenu className="text-gray-500 h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center flex-1">
            <Link href="/dashboard" className='flex items-center space-x-1'>
              <LuLeafyGreen className="text-[#2F855A] h-5 w-5" />
              <span className="font-bold text-[#2F855A] text-lg">agromatch</span>
            </Link>
            <span className="ml-2 text-xs text-gray-500">Painel do Mediador</span>
          </div>
          
          <div className="flex items-center space-x-4 pr-4">
            {/* Botão de Alto Contraste */}
            <button 
              onClick={toggleContrast}
              className="text-gray-500 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-200"
              title={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            >
              {highContrast ? (
                <LuEyeOff className="h-5 w-5" />
              ) : (
                <LuEye className="h-5 w-5" />
              )}
              <span className="sr-only">Alto contraste</span>
            </button>
            
            {/* Notificações */}
            <button className="text-gray-500 hover:text-gray-600 transition-colors">
              <LuBell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
            </div>
            
            <div className="relative">
              <button 
                className="text-gray-500 hover:text-gray-600 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              >
                <LuSettings className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                >
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <LuUser className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LuLogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
}

export default NavBar