import { Modal } from '@/app/ui/utils/alert/modal'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Form } from '@/app/ui/form/form/form'
import styles from './delete.module.css'


export default function DeleteModal({title = '¿Estas Seguro De Eliminar Este Elemento?', show = true, onClose = null}) {
    
    const handleCancel = () => {
        onClose(false)
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
            > 
                <p>Esta acción no se puede deshacer.</p>
                <Container
                    padding={'12px'}
                >
                    <Form className={styles.form}>
                        <Button
                            role="submit"
                            type={'secondary'}
                        >
                            Si, eliminar
                        </Button>
                        <Button
                            type={'danger'}
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                    </Form>
                </Container>
                <p className='p2-b success_message'></p>
                <p className='p2-b field_error'></p>
            </Container>
        </Modal>

    )
}