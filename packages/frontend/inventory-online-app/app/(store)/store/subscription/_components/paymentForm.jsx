'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { OvalLoader } from '@/app/ui/loader/spinner'
import SubmitPaymentAction from '@/app/lib/actions/submitPayment'
import { useActionState, useState } from 'react'
import styles from '@/app/(store)/store/subscription/_components/subscription.module.css'

export default function PaymentForm() {
    const initialState = {message: null, errors: {}, inputs: {}}
    const [state, formAction, isPending] = useActionState(SubmitPaymentAction, initialState)
    const [fileName, setFileName] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        setFileName(file ? file.name : null)
    }

    return (
        <div className={`${styles.card} shadow`}>
            <fieldset className={styles.fieldset}>
                <legend className={`p2-b ${styles.legend}`}>Reportar un pago</legend>
                <p className='p3-r' style={{color: '#888'}}>
                    Sube el comprobante de tu transferencia o pago móvil. Un administrador lo revisará y activará tu suscripción.
                </p>
                <Form action={formAction}>
                    <Input
                        type="number"
                        icon="cash"
                        name="amount"
                        placeHolder="Monto pagado (Bs)"
                        defaultValue={state.inputs?.amount ?? ''}
                        step="0.01"
                        min="0.01"
                    />
                    {state?.errors?.amount && <span className="field_error">{state?.errors?.amount}</span>}

                    <Input
                        showIcon={false}
                        id="receipt"
                        type="file"
                        name="receipt"
                        accept="image/*,.pdf"
                        required={true}
                        onChange={handleFileChange}
                    />

                    <Container width="100%" padding="12px 16px" borderRadius="8px" backgroundColor="var(--color-neutralGrey600)" justifyContent="start">
                        <label htmlFor="receipt" style={{cursor: 'pointer'}}>
                            Seleccionar comprobante
                        </label>
                        {fileName && <span className='p3-r'>{fileName}</span>}
                    </Container>

                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                    <Button role="submit" type="secondary" disabled={isPending}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Enviando...' : 'Enviar comprobante'}
                    </Button>
                </Form>
            </fieldset>
        </div>
    )
}
