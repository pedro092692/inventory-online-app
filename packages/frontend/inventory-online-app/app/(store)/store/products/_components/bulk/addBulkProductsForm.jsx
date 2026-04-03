'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import AddBulkAction from '@/app/lib/actions/addBulkProducts'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState } from 'react'

export default function AddBulkProductsForm() {
    const initialState = {message: null, errors: null}
    const [state, formAction, isPending] = useActionState(AddBulkAction, initialState)
    return (
        <Form action={formAction}>
            <Input showIcon={false} icon='upload' type='file' name='file' label='Archivo de productos' accept='.xlsx, .xls, .csv, .ods' />
            
            {state?.errors && <span className="field_error">{state?.errors}</span>}
            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary"> 
                {isPending && <OvalLoader />}
                {isPending ? 'Guardando Productos...' : 'Guardar Productos'}
            </Button>
        </Form>
    )
}