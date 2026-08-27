'use client'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useEffect } from 'react'

/**
 * Generic confirm-before-you-act modal, built on top of the app's <Modal/>. It owns the
 * useActionState for the bound server action passed as `action`, so the caller only has
 * to decide *when* to show it (e.g. on a button click) and *what* action it triggers —
 * this is what powers both the "confirm before Aprobar" and "confirm before Revertir"
 * flows in /admin/payments, since both are just "run this bound action after a confirm".
 */
export default function ConfirmActionModal({
    show,
    onClose,
    title = 'Confirmar acción',
    message,
    action,
    confirmLabel = 'Sí, continuar',
    pendingLabel = 'Procesando...',
    cancelLabel = 'Cancelar',
    iconColor = 'var(--color-accentYellow400)'
}) {
    const initialState = { message: null, errors: {}, inputs: {} }
    const [state, dispatch, isPending] = useActionState(action, initialState)

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
            title={title}
            showIcon={true}
            icon="alert"
            iconColor={iconColor}
        >
            <Container
                direction="column"
                padding="0px"
                width="100%"
                justifyContent="start"
                gap="0px"
            >
                <p>{message}</p>
                <Container padding="12px">
                    <Container padding="0px" direction="row">
                        <Button type="secondary" disabled={isPending} onClick={() => dispatch()}>
                            {isPending && <OvalLoader/>}
                            {isPending ? pendingLabel : confirmLabel}
                        </Button>
                        <Button type="danger" onClick={handleCancel} disabled={isPending}>
                            {cancelLabel}
                        </Button>
                    </Container>
                </Container>
                {state?.message && <p className="p3-r" style={{color: 'var(--color-accentGreen400)'}}>{state.message}</p>}
                {state?.errors?.error && <span className="field_error">{state.errors.error}</span>}
            </Container>
        </Modal>
    )
}
