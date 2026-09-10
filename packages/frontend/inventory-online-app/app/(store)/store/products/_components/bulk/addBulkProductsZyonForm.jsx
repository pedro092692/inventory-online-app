'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import AddBulkZyonAction from '@/app/lib/actions/addBulkProductsZyon'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState } from 'react'
import { Container } from '@/app/ui/utils/container'
import styles from '@/app/(store)/store/products/_components/bulk/addBulk.module.css'

export default function AddBulkProductsZyonForm({ defaultExchangeRate = '' }) {
    const initialState = {message: null, errors: null, skippedRows: []}
    const [state, formAction, isPending] = useActionState(AddBulkZyonAction, initialState)
    const [fileName, setFileName] = useState(null)

    const handleOnChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
        }
    }

    return (
        <Form action={formAction} style={{padding: '0px'}}>
            <Input showIcon={false} id={'zyonFile'} icon='upload'
                className={styles.fileInput} type='file' name='file' label='Archivo de inventario Zyon'
                accept='.txt, .csv'
                onChange={(e) => handleOnChange(e) }
            />

            <Container
                width={'100%'}
                padding={'20px'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey500)'}
                className='shadow'
                justifyContent={'start'}
            >
                <label htmlFor='zyonFile' className={styles.fileLabel}>
                   Seleccionar archivo (.txt, .csv)
                </label>

                {fileName && <span>{fileName}</span>}
            </Container>

            <label>Tasa de cambio del día (Bs por $)</label>
            <Input type='number' step='0.01' min='0.01' icon='dollar'
                defaultValue={defaultExchangeRate}
                name='exchangeRate'
            />
            <span className='p3-r'>Los precios del archivo vienen en bolívares; se dividen por esta tasa para guardarse en dólares, como el resto de Nexastock.</span>

            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.errors && typeof state.errors === 'string' && <span className="field_error">{state?.errors}</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

            {state?.skippedRows?.length > 0 && (
                <Container
                    direction={'column'}
                    width={'100%'}
                    padding={'8px 12px'}
                    gap={'2px'}
                    alignItem={'start'}
                    backgroundColor={'var(--color-neutralGrey300)'}
                    borderRadius={'8px'}
                >
                    <span className='p3-b'>Ejemplos de filas omitidas:</span>
                    {state.skippedRows.slice(0, 5).map((skipped, index) => (
                        <span className='p3-r' key={`${skipped.row}-${index}`}>
                            Fila {skipped.row}{skipped.name ? ` (${skipped.name})` : ''}: {skipped.reason}
                        </span>
                    ))}
                </Container>
            )}

            <Button role="submit" type="secondary">
                {isPending && <OvalLoader />}
                {isPending ? 'Guardando Productos...' : 'Guardar Productos'}
            </Button>
        </Form>
    )
}
