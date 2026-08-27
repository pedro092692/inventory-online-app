'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { Icon } from '@/app/ui/utils/icons/icons'
import FloatInput from '@/app/ui/form/input/floatInput'
import SubmitPaymentAction from '@/app/lib/actions/submitPayment'
import { useActionState, useState } from 'react'
import styles from '@/app/(store)/store/subscription/_components/subscription.module.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, igual al límite de multer en el backend
const MAX_FILE_LABEL = '5MB'

export default function PaymentForm() {
    const initialState = {message: null, errors: {}, inputs: {}}
    const [state, formAction, isPending] = useActionState(SubmitPaymentAction, initialState)
    const [fileName, setFileName] = useState(null)
    const [fileError, setFileError] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            setFileName(null)
            setFileError(null)
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileName(null)
            setFileError(`El archivo pesa demasiado (máximo ${MAX_FILE_LABEL}). Elige una imagen más liviana o comprímela.`)
            e.target.value = ''
            return
        }

        setFileName(file.name)
        setFileError(null)
    }

    const handleSubmit = (formData) => {
        const file = formData.get('receipt')
        if (file && file.size > MAX_FILE_SIZE) {
            setFileError(`El archivo pesa demasiado (máximo ${MAX_FILE_LABEL}). Elige una imagen más liviana o comprímela.`)
            return
        }
        return formAction(formData)
    }

    return (
        <Container
            direction={'column'}
            padding={'16px'}
            gap={'8px'}
            borderRadius={'8px'}
            className='shadow-sm'
            backgroundColor="var(--color-neutralGrey200)" 
        >
                <p className='p2-r'>
                    Sube el comprobante de tu transferencia o pago móvil. Un administrador lo revisará y activará tu suscripción.
                </p>
                <Form action={handleSubmit}>
                    <Container
                        padding={'0px 0px 0px 16px'}
                        backgroundColor={'var(--color-neutralGrey300)'}
                        width='100%'
                        gap={'4px'}
                        borderRadius='8px'
                        justifyContent='start'
                    >  
                        <Icon icon={'cash'} color='black'/>
                        <FloatInput inputValue={state.inputs?.amount ?? false} name='amount'/>
                    </Container>
                    {state?.errors?.amount && <span className="field_error">{state?.errors?.amount}</span>}

                    <Input
                        showIcon={false}
                        id="receipt"
                        type="file"
                        name="receipt"
                        accept="image/*,.pdf"
                        required={true}
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />

                    <Container width="100%" padding="12px 16px" borderRadius="8px" backgroundColor="var(--color-neutralGrey400)"  justifyContent="start">
                        <label htmlFor="receipt" style={{cursor: 'pointer'}}>
                            Seleccionar comprobante
                        </label>
                        {fileName && <span className='p3-r'>{fileName}</span>}
                    </Container>
                    <p className='p3-r' style={{color: '#888'}}>Tamaño máximo: {MAX_FILE_LABEL}</p>
                    {fileError && <span className="field_error">{fileError}</span>}

                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                    <Button role="submit" type="secondary" disabled={isPending || !!fileError}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Enviando...' : 'Enviar comprobante'}
                    </Button>
                </Form>
        </Container>
    )
}
