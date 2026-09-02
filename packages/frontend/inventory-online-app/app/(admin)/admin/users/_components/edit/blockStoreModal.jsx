'use client'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { OvalLoader } from '@/app/ui/loader/spinner'
import EditItemAction from '@/app/lib/actions/edit'
import { useActionState, useEffect } from 'react'

export default function BlockStoreModal({show, onClose, tenantId}) {
    const initialState = {message: null, errors: {}, inputs: {}}
    const blockStore = EditItemAction.bind(null, `users/store/${tenantId}/block`, ['reason'], 'Tienda bloqueada')
    const [state, formAction, isPending] = useActionState(blockStore, initialState)

    const handleCancel = () => {
        onClose(false)
    }

    useEffect(() => {
        const success = state?.message
        if (success) {
            const timer = setTimeout(() => {
                handleCancel()

            }, 450)
            return () => clearTimeout(timer)
        }
    }, [state?.message])

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Bloquear tienda"
            showIcon={true}
            icon="padlock"
            iconColor="var(--color-accentRed400)"
        >
            <Container
                direction="column"
                padding="0px"
                width="100%"
                justifyContent="start"
                gap="0px"
            >
                <p>La tienda quedará inactiva de inmediato. El motivo queda registrado y podrás desbloquearla luego.</p>
                <Container 
                    padding="12px"
                    width={'100%'}
                >
                    <Form action={formAction}>
                        <Input
                            type="text"
                            icon="paper"
                            name="reason"
                            placeHolder="Motivo del bloqueo (ej: uso indebido de la plataforma)"
                            defaultValue={state.inputs?.reason ?? ''}
                            capitalize={true}
                            style={{width: '100%'}}
                        />
                        {state?.errors?.reason && <span className="field_error">{state?.errors?.reason}</span>}
                        <Container padding="0px" direction="row" width={'100%'} flexWrap={'wrap'}>
                            <Button role="submit" type="secondary" disabled={isPending}>
                                {isPending && <OvalLoader/>}
                                {isPending ? 'Bloqueando...' : 'Si, bloquear'}
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
