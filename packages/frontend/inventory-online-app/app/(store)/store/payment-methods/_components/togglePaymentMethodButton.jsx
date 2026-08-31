'use client'
import { useActionState } from 'react'
import { Form } from '@/app/ui/form/form/form'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { Container } from '@/app/ui/utils/container'
import togglePaymentMethodAction from '@/app/lib/actions/togglePaymentMethodAction'

/**
 * Toggle button for a payment method row (activo/desactivado).
 * - Disables itself while the request is in flight so a user mashing the
 *   button doesn't fire several toggle requests in a row.
 * - Shows "activado"/"desactivado" confirmation, or the backend's error
 *   (e.g. "no puedes desactivar el último método de pago disponible").
 */
export default function TogglePaymentMethodButton({ id, isActive }) {
    const initialState = { message: null, errors: {} }
    const [state, formAction, isPending] = useActionState(togglePaymentMethodAction, initialState)

    return (
        <Container
            gap={'0px'}
            direction={'column'}
            justifyContent={'center'}
            alignItem={'center'}
            padding={'0px'}
        >
            <Form action={formAction} style={{padding: '0px'}}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="status" value={isActive ? 'true' : 'false'} />
                <Button
                    role="submit"
                    disabled={isPending}
                    style={{
                        backgroundColor: isActive ? 'var(--color-accentRed400, #e53e3e)' : 'var(--color-accentGreen400, #38a169)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        opacity: isPending ? 0.7 : 1,
                        width: '100%'
                    }}
                >
                    {isPending && <OvalLoader size={[14, 14]} />}
                    {isPending ? ' Actualizando...' : (isActive ? ' Desactivar' : ' Activar')}
                </Button>
                {state?.message && <span key={id} className='p3-r success_message'>{state.message}</span>}
                {state?.errors?.error && <span key={id} className='p3-r field_error'>{state.errors.error}</span>}
            </Form>

           
        </Container>
    )
}
