import styles from '../totalInfo/totalInfo.module.css'
import { Button } from '@/app/ui/utils/button/buttons'
import localStyles from './sucess.module.css'
import GenerateLinkButton from '@/app/(store)/store/bills/_components/detail/whatsappLink/generateButton'

export default function SuccessInfo({state={}, onClick=() => ''}) {
    const link = state?.ws_link || null
    
    return (
        <div className={`${styles.infoContainer} shadow-bottom-sm ${localStyles.container}`}>
            <p className='p1-b success_message '>{state?.message}</p>
            <div className={localStyles.buttonsContainer}>
                <GenerateLinkButton link={link} message={'Enviar Factura Por Whatsapp'}/>   
                <Button 
                    type={'primary'} 
                    showIcon={'true'} 
                    icon={'sell'}
                    children={'Nueva Venta'}
                    onClick={onClick}
                />
            </div>        
        </div>
    )
}