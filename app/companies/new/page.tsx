"use client";

import { TextField, Button, TextArea } from '@radix-ui/themes'
import "easymde/dist/easymde.min.css"
import SimpleMDE from "react-simplemde-editor"

const NewCompanyPage = () => {
  return (
    <div className='max-w-xl space-y-3'>
        <TextField.Root placeholder="Title" />
        {/* <TextArea placeholder="Description" />*/}
        <SimpleMDE placeholder="Description" />
        <Button>Add new company</Button>

    </div>
  )
}

export default NewCompanyPage