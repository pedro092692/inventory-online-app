import { Container } from '@/app/ui/utils/container'
import { useEffect } from 'react'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from './modal.module.css'

export function Modal({
        show=false, 
        onClose=null, 
        title='Default Alert', 
        showIcon=false, 
        icon='person',
        iconColor='black', 
        children
    }) {
    const handleClose = () => {
        onClose(false)
    }

    useEffect(() => {
        if (!show) {
            document.body.style.overflow = 'unset'
            return
        }
        document.body.style.overflow = 'hidden'
        const handleEsc = (event) => {
            console.log(document.body.style.overflow)
            if (event.key === 'Escape') {
                onClose(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('keydown', handleEsc)
        }
    }, [show, onClose])

    

    return (
        <div className={`${styles.container} ${show ? styles.active : ''}`}
            onClick={handleClose}
        >
            <Container 
                direction={'column'}
                justifyContent={'start'}
                alignItem={'center'}
                className={`${styles.alert} shadow`}
                onClick={(e) => e.stopPropagation()}
                pading={'8px 16px'}
            > 
                {showIcon && <Icon icon={icon} color={iconColor} size={[48, 48]}/>}
                <h2>{title}</h2>
                <div>
                    {children}
                </div>
            </Container>
        </div>
    )
}