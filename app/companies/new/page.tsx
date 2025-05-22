import React from 'react'
import { TextField, TextArea, Button } from '@radix-ui/themes'

const NewCompanyPage = () => {
  return (
    <div className='max-w-xl space-y-3'>
        <TextField.Root placeholder="Title" />
        <TextArea placeholder="Description" />
        <Button>Add new company</Button>

    </div>
  )
}

export default NewCompanyPage