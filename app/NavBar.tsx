import React from 'react'
import Link from 'next/link'
import { LuLeafyGreen } from "react-icons/lu";

function NavBar() {
    const links = [
        { label: "Dashboard", href: "/" },
        { label: "Empresas", href: "/companies" },
    ]
  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
        <Link href="/"><LuLeafyGreen /></Link>
        <ul className='flex space-x-6'>
            {links.map(link => 
            <Link 
            key={link.href} 
            className='text-zinc-500 hover:text-zinc-800 transition-colors' href={link.href}>{link.label}</Link>)}
        </ul>
    </nav>
  )
}

export default NavBar