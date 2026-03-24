import { Modal } from '@/app/ui/utils/alert/modal'

export default function DeleteModal({title = '¿Estas Seguro De Eliminar Este Elemento?'}) {
    
    return(

        <Modal 
            title={title}
            showIcon={true}
            icon='trash'
            iconColor='var(--color-accentRed400)'              
        />
    )
}