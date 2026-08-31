'use client'
import { useState, useActionState } from 'react'
import { Form } from '@/app/ui/form/form/form'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import UpdateBufferRateAction from '@/app/lib/actions/updateBufferRate'
import InputStyles from '@/app/ui/form/input/input.module.css'
import styles from '@/app/(store)/store/currency/_components/bufferRate/bufferRate.module.css'

// Global, store-wide "tasa colchón" (buffer rate) setting. When enabled, it becomes the
// rate used everywhere Bs prices are shown or charged — catálogo, carrito, Cotizar,
// Etiquetas, facturas y pagos en bolívares — so the precio en el anaquel siempre cuadra
// con lo que se cobra en caja. Pagos en dólares (efectivo/transferencia $) no se ven
// afectados: no pasan por ninguna tasa de cambio.
export default function BufferRateForm({ settings, officialRate = null, bufferIsStale = false }) {
    const initialState = { message: null, inputs: {}, errors: {} }
    const [state, formAction, isPending] = useActionState(UpdateBufferRateAction, initialState)
    const [enabled, setEnabled] = useState(settings?.buffer_enabled ?? false)

    const handleSubmit = (formData) => {
        formData.set('buffer_enabled', enabled ? 'true' : 'false')
        formAction(formData)
    }

    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <h3 className='p2-b'>Tasa colchón</h3>
            <p className='p3-r' style={{ color: 'var(--color-neutralGrey900)' }}>
                Al activarla, todos los precios en bolívares de la tienda (catálogo, Vender,
                Cotizar, Etiquetas, facturas y pagos en Bs) se calculan con esta tasa en vez
                de la tasa oficial de Divisa, Suben el valor en divisas para compesar. Asi los
                precios coinciden con el valor de la tasa oficial.
            </p>

            {bufferIsStale &&
                <p className={`p3-r ${styles.staleWarning}`}>
                    ⚠️ Tu tasa colchón ({settings?.buffer_rate}) ya fue alcanzada por la tasa
                    oficial actual ({officialRate}). Mientras tanto se está usando la tasa
                    oficial para no vender por debajo de su valor real — sube la tasa colchón
                    para que vuelva a tener efecto.
                </p>
            }

            <label className={styles.toggleRow}>
                <input
                    type='checkbox'
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                />
                <span className='p2-r'>Activar tasa colchón</span>
            </label>

            {enabled &&
                <Container
                    padding={'0px 0px 0px 16px'}
                    backgroundColor={'var(--color-neutralGrey300)'}
                    width='100%'
                    gap={'0px'}
                    borderRadius='8px'
                    justifyContent='start'
                >
                    <Icon icon={'dollar'} color='black' />
                    <input
                        type='number'
                        step='0.01'
                        min='0'
                        name='buffer_rate'
                        defaultValue={settings?.buffer_rate ?? ''}
                        placeholder='Tasa de su preferencia.'
                        className={`p2-r ${InputStyles.input}`}
                        style={{width: '100%'}}
                    />
                </Container>
            }

            {state?.errors?.error && <span className='field_error'>{state?.errors?.error}</span>}
            {state?.errors && typeof state.errors != 'object' && <span className='field_error'>{state?.errors}</span>}
            {state?.message && <span style={{ color: 'green', marginTop: '8px' }}>{state?.message}</span>}

            <Button role='submit' type='secondary' disabled={isPending}>
                {isPending && <OvalLoader />}
                {isPending ? 'Guardando...' : 'Guardar configuración'}
            </Button>
        </Form>
    )
}
