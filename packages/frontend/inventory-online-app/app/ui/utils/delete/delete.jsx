import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { deleteResource } from '@/app/utils/deleteResource'
import { useState, useEffect, use } from 'react'


export default function ActionDelete(
    {
        onClose=null, 
        urlPath='', 
        id=null, 
        params=null, 
        variableName='id', 
        sucessMessage='Recurso eliminado exitosamente',
        setTableData=null,
        show=false,
    }) {
    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        if (!show) {
            const timer = setTimeout(() => {
                setMessage(null)
                setErrors(null)
            }, 400)
            return () => clearTimeout(timer)
        }
    }, [show])

    const handleCancel = () => {
        onClose(false)
        setErrors('')
        setMessage('')
    }

    const handleDelete = async () => {
        if(!errors){
            const response = await deleteResource(urlPath, {[variableName]: id})
            if (response === 1){
                setMessage(sucessMessage)
                setErrors('')
                setTableData && setTableData(prev => prev.filter(item => item.id !== id))
                setTimeout(() => {
                    onClose(false)
                }, 1000)
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