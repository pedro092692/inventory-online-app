'use client'
import styles from '../totalInfo/totalInfo.module.css'
import { Button } from '@/app/ui/utils/button/buttons'
import localStyles from './sucess.module.css'
import GenerateLinkButton from '@/app/(store)/store/bills/_components/detail/whatsappLink/generateButton'
import { useEffect, useRef } from 'react'

export default function SuccessInfo({state={}, onClick=() => '', time=null}) {
    const link = state?.ws_link || null
    const newSaleRef = useRef(null)

    // Auto-focus "Nueva Venta" as soon as the sale succeeds, so pressing
    // Enter right away starts the next sale without touching the mouse.
    useEffect(() => {
        newSaleRef.current?.focus()
    }, [])

    return (
        <div className={`${styles.infoContainer} shadow-bottom-sm ${localStyles.container}`}>
            <p className='p1-b success_message '>{state?.message}</p>
            <div className={localStyles.buttonsContainer}>
                <GenerateLinkButton link={link} message={'Enviar Factura Por Whatsapp'}/>
                <Button
                    ref={newSaleRef}
                    type={'primary'}
                    showIcon={'true'}
                    icon={'sell'}
                    children={time ? `Nueva Venta en ${time}s` :'Nueva Venta'}
                    onClick={onClick}
                />
            </div>
        </div>
    )
}
