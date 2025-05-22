'use client';

import { useState, createContext, useEffect } from "react";
import NavBar from "./NavBar"
import Sidebar from "./components/Sidebar"
import "./globals.css"
import { Theme } from "@radix-ui/themes"
import { Inter } from "next/font/google"
import '@radix-ui/themes/styles.css'
import './theme-config.css'
import { usePathname } from 'next/navigation'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
})

// Criar contexto para o estado da sidebar
export const SidebarContext = createContext({
  isOpen: true,
  toggle: () => {}
});

// Criar contexto para o alto contraste
export const ContrastContext = createContext({
  highContrast: false,
  toggleContrast: () => {}
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/signup';
  
  // Estado para controlar a visibilidade da sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Estado para controlar o alto contraste
  const [highContrast, setHighContrast] = useState(false);
  
  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Função para alternar o alto contraste
  const toggleContrast = () => {
    setHighContrast(!highContrast);
    // Salvar a preferência no localStorage
    localStorage.setItem('highContrast', String(!highContrast));
  };
  
  // Carregar a preferência de alto contraste do localStorage
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast');
    if (savedContrast === 'true') {
      setHighContrast(true);
    }
  }, []);

  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <style jsx global>{`
          .high-contrast {
            filter: invert(100%);
          }
          
          .high-contrast img,
          .high-contrast video {
            filter: invert(100%);
          }
        `}</style>
      </head>
      <body className={highContrast ? 'high-contrast' : ''}>
        <Theme accentColor="jade">
          <ContrastContext.Provider value={{ highContrast, toggleContrast }}>
            <SidebarContext.Provider value={{ isOpen: isSidebarOpen, toggle: toggleSidebar }}>
              <NavBar />
              <Sidebar />
              <main 
                className={
                  isAuthPage 
                  ? 'pt-20 px-6 pb-6' 
                  : isSidebarOpen 
                    ? 'pt-20 pl-[90px] pr-6 pb-6' 
                    : 'pt-20 px-6 pb-6'
                }
              >
                {children}
              </main>
            </SidebarContext.Provider>
          </ContrastContext.Provider>
        </Theme>
      </body>
    </html>
  )
}