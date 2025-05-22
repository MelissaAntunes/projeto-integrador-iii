'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LuMail, LuPhone, LuExternalLink } from 'react-icons/lu';
import { FaBuilding } from 'react-icons/fa';

interface CompanyCardProps {
  id: string;
  name: string;
  logo_url: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

const CompanyCard = ({ id, name, logo_url, email, phone, website, address }: CompanyCardProps) => {
  const [imgError, setImgError] = useState(false);

  // Style para o container do logo
  const logoContainerStyle = {
    border: '1px solid #f2f2f2',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="mb-4 h-20 w-full flex items-center justify-center">
          {logo_url && !imgError ? (
            <div style={logoContainerStyle}>
              <img 
                src={logo_url}
                alt={`${name} Logo`}
                className="max-h-16 max-w-full object-contain"
                onError={(e) => {
                  console.log(`Error loading image for ${name}:`, logo_url);
                  setImgError(true);
                }}
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <FaBuilding className="text-gray-400 text-2xl" />
            </div>
          )}
        </div>
        
        <h3 className="text-base font-semibold text-[#2F855A] text-center mb-4">{name}</h3>
        
        <div className="space-y-1.5 text-xs text-gray-600 mt-3">
          {phone && (
            <div className="flex items-center">
              <LuPhone className="text-gray-400 mr-2 flex-shrink-0 h-3 w-3" />
              <a href={`tel:${phone}`} className="hover:underline truncate">{phone}</a>
            </div>
          )}
          
          {email && (
            <div className="flex items-center">
              <LuMail className="text-gray-400 mr-2 flex-shrink-0 h-3 w-3" />
              <a href={`mailto:${email}`} className="hover:underline truncate">{email}</a>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-2 flex justify-end">
        <Link 
          href={`/companies/${id}`}
          className="text-xs text-[#2F855A] bg-[#E8F5E9] px-2 py-1 rounded hover:bg-[#C8E6C9] transition-colors flex items-center gap-1"
        >
          <span>Ver Detalhes</span>
          <LuExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}

export default CompanyCard; 