import React from 'react'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

const CompaniesPage = () => {
  return (
    <div><Button><Link href="/companies/new">New Company</Link></Button></div>
  )
}

export default CompaniesPage