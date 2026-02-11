import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'

export default function ActionDelete({onClose=null, onDelete=null}){
    
    const handleCancel = () => {
        onClose(false)
    }

    const handleDelete = () => {
        console.log('Eliminando Cliente...')
    }


    return (
        <Container 
            direction={'column'}
            padding={'8px'}
        > 
            <p>Esta acción no se puede deshacer.</p>
            <Container
                padding={'16px'}
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
        </Container>
        
    )
}