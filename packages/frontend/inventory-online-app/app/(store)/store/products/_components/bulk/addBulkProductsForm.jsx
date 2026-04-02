'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import AddBulkAction from '@/app/lib/actions/addBulkProducts'
import { useActionState } from 'react'

export default function AddBulkProductsForm() {
    const initialState = {message: null, errors: {}}
    const [state, formAction, isPending] = useActionState(AddBulkAction, initialState)
    return (
        <Form action={formAction}>
            <Input showIcon={false} icon='upload' type='file' name='file' label='Archivo de productos' accept='.xlsx, .xls, .csv' />
            <Button role="submit" type="secondary"> Subir archivo</Button>
        </Form>
    )
}