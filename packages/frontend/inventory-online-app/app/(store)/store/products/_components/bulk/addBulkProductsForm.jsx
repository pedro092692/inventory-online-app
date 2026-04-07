'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import AddBulkAction from '@/app/lib/actions/addBulkProducts'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import styles from '@/app/(store)/store/products/_components/bulk/addBulk.module.css'

export default function AddBulkProductsForm() {
    const initialState = {message: null, errors: null}
    const [state, formAction, isPending] = useActionState(AddBulkAction, initialState)
    const [fileName, setFileName] = useState(null)

    const handleOnChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    } 
    return (
        <Form action={formAction} >
            <Input showIcon={false} id={'file'} icon='upload' 
                className={styles.fileInput} type='file' name='file' label='Archivo de productos' 
                accept='.xlsx, .xls, .csv, .ods' 
                onChange={(e) => handleOnChange(e) }   
            />
            
            <Container
                width={'100%'}
                padding={'20px'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
                justifyContent={'start'}
            >
                <label htmlFor='file' className={styles.fileLabel}>
                   Seleccionar archivo
                </label>

                {fileName && <span>{fileName}</span>}
            </Container>
            {state?.errors && <span className="field_error">{state?.errors}</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary"> 
                {isPending && <OvalLoader />}
                {isPending ? 'Guardando Productos...' : 'Guardar Productos'}
            </Button>
        </Form>
    )
}