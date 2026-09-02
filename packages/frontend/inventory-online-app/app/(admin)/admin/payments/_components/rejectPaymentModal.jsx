'use client'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { OvalLoader } from '@/app/ui/loader/spinner'
import RejectPaymentAction from '@/app/lib/actions/rejectPayment'
import { useActionState, useEffect } from 'react'

export default function RejectPaymentModal({show, onClose, paymentId}) {
    const initialState = {message: null, errors: {}, inputs: {}}
    const rejectAction = RejectPaymentAction.bind(null, paymentId)
    const [state, formAction, isPending] = useActionState(rejectAction, initialState)

    const handleCancel = () => {
        onClose(false)
    }

    useEffect(() => {
        if (state?.message) {
            const timer = setTimeout(() => {
                onClose(true)
            }, 850)
            return () => clearTimeout(timer)
        }
    }, [state?.message])

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Rechazar pago"
            showIcon={true}
            icon="alert"
            iconColor="var(--color-accentRed400)"
        >
            <Container
                direction="column"
                padding="0px"
                width="100%"
                justifyContent="start"
                gap="0px"
            >
                <p>Indica el motivo del rechazo. El dueño de la tienda podrá verlo y enviar un nuevo comprobante.</p>
                <Container padding="12px" width={'100%'}>
                    <Form action={formAction}>
                        <Input
                            type="text"
                            icon="paper"
                            name="reason"
                            placeHolder="Motivo del rechazo (ej: el monto no coincide)"
                            defaultValue={state.inputs?.reason ?? ''}
                            capitalize={true}
                            style={{width: '100%'}}
                        />
                        {state?.errors?.reason && <span className="field_error">{state?.errors?.reason}</span>}
                        <Container padding="0px" direction="row" width={'100%'} flexWrap={'wrap'}>
                            <Button role="submit" type="secondary" disabled={isPending}>
                                {isPending && <OvalLoader/>}
                                {isPending ? 'Rechazando...' : 'Sí, rechazar'}
                            </Button>
                            <Button type="danger" onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </Container>
                    </Form>
                </Container>
                {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
            </Container>
        </Modal>
    )
}
