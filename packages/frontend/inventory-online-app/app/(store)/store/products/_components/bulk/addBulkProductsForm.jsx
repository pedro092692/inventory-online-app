'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'

export default function AddBulkProductsForm() {
    return (
        <Form>
            <Input showIcon={false} icon='upload' type='file' name='productsFile' label='Archivo de productos' accept='.xlsx, .xls, .csv' />
            <Button role="submit" type="secondary"> Subir archivo</Button>
        </Form>
    )
}