'use client'

import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useEffect, useState } from 'react'
import styles from '../actions/delete.module.css'

export default function ActionModal({
        show = true,
        onClose = null,
        title = '',
        message = '',
        icon = 'warning',
        iconColor = 'var(--color-accentRed400)',
        action,
        requirePin = false,
        pin = null,
        onChangePin = null,
        customPin = null,
        confirmText = 'Aceptar',
        confirmType = 'danger',
        cancelText = 'Cancelar',
        successDelay = 850,
        onSuccess = null,

    }) {
        
        const initialState = {
            message: null,
            error: null
        }

        const [state, formAction, isPending] = useActionState(action, initialState)

        const [supervisorPin, setSupervisorPin] = useState('')
        const [noPin, setNoPin] = useState(false)

        const handleCancel = () => {
            onClose?.(false)
        }

        useEffect(() => {
            if (!state?.message) return

            const timer = setTimeout(() => {
                onSuccess?.(state)
                handleCancel()

            }, successDelay)

            return () => clearTimeout(timer)

        }, [state?.message])

        const handleSubmit = (formData) => {
            if (requirePin) {
                const pinValue = formData.get('pin')

                if (!pinValue) {
                    setNoPin(true)
                    return
                }

            }
            formAction(formData)
        }
             
        return (

        <Modal
            show={show}
            onClose={onClose}
            title={title}
            showIcon
            icon={icon}
            iconColor={iconColor}
            ignoreEnter={true}
        >

            <Container
                direction='column'
                width='100%'
                padding='0px'
                justifyContent='start'
                gap='0px'
            >

                {message && <p>{message}</p>}

                <Container padding='12px'>

                    <Form
                        className={styles.form}
                        action={handleSubmit}
                    >

                        <Container
                            direction='column'
                            padding='0px'
                        >

                            {requirePin && (

                                <Input
                                    type='text'
                                    inputMode='numeric'
                                    placeHolder='PIN del supervisor'
                                    icon='padlock'
                                    autocomplete='off'
                                    name='pin'
                                    value={supervisorPin}
                                    className={styles.pinInput}
                                    required={false}
                                    autoFocus={true}
                                    onChange={(e) => {

                                        const value = e.target.value

                                        if (/^[0-9]*$/.test(value)) {

                                            onChangePin
                                                ? customPin(value)
                                                : setSupervisorPin(value)

                                        }

                                        setNoPin(false)

                                    }}
                                />

                            )}

                            {noPin &&
                                <p className='errorMsg'>
                                    El PIN es requerido.
                                </p>
                            }

                            <Container
                                direction='row'
                                padding='0px'
                            >

                                <Button
                                    role='submit'
                                    type={confirmType}
                                >

                                    {isPending && <OvalLoader />}

                                    {
                                        isPending
                                            ? 'Procesando...'
                                            : confirmText
                                    }

                                </Button>

                                <Button
                                    type='secondary'
                                    onClick={handleCancel}
                                >

                                    {cancelText}

                                </Button>

                            </Container>

                        </Container>

                    </Form>

                </Container>

                <p className='p2-b success_message'>
                    {state?.message}
                </p>

                <p className='p2-b field_error'>
                    {state?.error}
                </p>

            </Container>

        </Modal>

    )

}