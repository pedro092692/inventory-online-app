'use client'
import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import styles from './delete.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
// import deleteFuncion from '@/app/lib/actions/customers/delete'
import deleteFuncion from '@/app/lib/actions/deleteResource'
import { useActionState, useEffect } from 'react'

export default function DeleteModal({
        title = '¿Estas Seguro De Eliminar Este Elemento?', 
        show = true, 
        onClose = null, 
        id = null, 
        path = '', 
        deleteKey = '',
        deleteMsg = 'Elemento eliminado con éxito'

    }) {
    const initialState = {message: null, error: null}
    const deleteResource = deleteFuncion.bind(null, id, path, deleteKey, deleteMsg)
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
                    <Form className={styles.form} action={formAction}>
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
                    </Form>
                </Container>
                <p className='p2-b success_message'>{state?.message}</p>
                <p className='p2-b field_error'>{state?.error}</p>
            </Container>
        </Modal>

    )
}