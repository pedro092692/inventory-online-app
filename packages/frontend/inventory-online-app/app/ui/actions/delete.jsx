'use client'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import styles from './delete.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import deleteFuncion from '@/app/lib/actions/delete'
import CancelResource from '@/app/lib/actions/cancelAction'
import { Input } from '@/app/ui/form/input/input'
import { useActionState, useEffect, useState } from 'react'

export default function DeleteModal({
        title = '¿Estas Seguro De Eliminar Este Elemento?', 
        show = true, 
        onClose = null, 
        id = null, 
        path = '', 
        deleteKey = '',
        deleteMsg = 'Elemento eliminado con éxito',
        cancelSupervisor = false,
        pin = null,
        onChangePin = null,
        customPin = null

    }) {
    const initialState = {message: null, error: null}
    const deleteResource = !cancelSupervisor ? 
        deleteFuncion.bind(null, id, path, deleteKey, deleteMsg)
        :
        CancelResource.bind(null, id, pin, path, deleteKey, deleteMsg)
    
    const [superVisorPin, setSuperVisorPin] = useState('')
    const [noPin, setNoPin] = useState(false)
    const [state, formAction, isPending] = useActionState(deleteResource, initialState)

    const handleCancel = () => {
        onClose(false)
    }
    
    useEffect(() => {
        const success = state?.message
        if (success) {
            const timer = setTimeout(() => {
                handleCancel()

            }, 850)
            return () => clearTimeout(timer)
        }
    }, [state?.message])

    const handleSubmit = (formData) => {
        const pinValue = formData.get("pin")
        if (!pinValue && pin) {
            setNoPin(true)
            return
        }
        return formAction(formData)
    }

    return(
        <Modal 
            show={show}
            onClose={onClose}
            title={title}
            showIcon={true}
            icon='trash'
            iconColor='var(--color-accentRed400)'              
        >
            <Container 
                direction={'column'}
                padding={'0px'}
                height={'100%'}
                width={'100%'}
                justifyContent={'start'}
                gap={'0px'}
            > 
                <p>Esta acción no se puede deshacer.</p>
                <Container
                    padding={'12px'}
                >
                    <Form className={styles.form} action={handleSubmit}>
                        <Container
                            padding={'0px'}
                            direction={'column'}
                        >   
                            { pin && <Input 
                                type={'text'}
                                inputMode={'numeric'}
                                placeHolder={'Pin de supervisor'}
                                icon={'padlock'} 
                                autocomplete={'off'}
                                name={'pin'}
                                value={superVisorPin}
                                onChange={(e) => {
                                    const v = e.target.value
                                    if (/^[0-9]*$/.test(v)) {
                                        onChangePin ? customPin(v) : setSuperVisorPin(v)
                                    } 
                                    setNoPin(false)
                                }}
                                className={styles.pinInput}
                                required={false}
                                /> 
                            }
                            { noPin && <p className='errorMsg'>El pin es requerido.</p>}
                            <Container
                                padding={'0px'}
                                direction={'row'}
                            >
                                
                                <Button
                                    role="submit"
                                    type={'secondary'}
                                >
                                    {isPending && <OvalLoader/>}   
                                    {isPending ? 'Eliminando...' : 'Si eliminar'} 
                                </Button>
                                <Button
                                    type={'danger'}
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                            </Container>
                        </Container>
                    </Form>
                </Container>
                <p className='p2-b success_message'>{state?.message}</p>
                <p className='p2-b field_error'>{state?.error}</p>
            </Container>
        </Modal>

    )
}