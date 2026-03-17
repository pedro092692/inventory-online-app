'use client'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { deleteResource } from '@/app/utils/deleteResource'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ActionDelete(
    {
        id=null,
        deleteKey = '',
        onClose=null, 
        endpoint='',
        isVisible=false,
        sucessMessage='Recurso eliminado exitosamente',
    }) {
        
    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState(null)

    const { replace } = useRouter()
    const pathname = usePathname()


    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                setMessage(null)
                setErrors(null)
            }, 400)
            return () => clearTimeout(timer)
        }
    }, [isVisible])

    const handleCancel = () => {
        onClose(false)
        setErrors('')
        setMessage('')
    }

    const handleDelete = async () => {
        if(!errors){
            const response = await deleteResource(endpoint, {[deleteKey]: id})
            if (response === 1){
                setMessage(sucessMessage)
                setErrors('')
                replace(pathname)
                setTimeout(() => {
                    onClose(false)
                }, 800)
            }else{
                setErrors(response)
                setMessage('')
            }
        }
    }
    


    return (
        <Container 
            direction={'column'}
            padding={'0px'}
            height={'100%'}
            width={'100%'}
            justifyContent={'start'}
        > 
            <p>Esta acción no se puede deshacer.</p>
            <Container
                padding={'12px'}
            >
                <Button
                    type={'secondary'}
                    onClick={handleDelete}
                >
                    Si, eliminar
                </Button>
                <Button
                    type={'danger'}
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
            </Container>
            <p className='p2-b success_message'>{message}</p>
            <p className='p2-b field_error'>{errors}</p>
        </Container>
        
    )
}