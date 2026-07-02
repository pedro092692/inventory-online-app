'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'

export default function GenerateLinkButton({link, message=''}) {

    const handleClick = () => {
        window.open(link, '_blank')
    }

    return (
        <Button type='grey' style={{backgroundColor: 'var(--color-blue700)', padding: '8px'}}
                            title={'Generar Enlace WhatsApp'} onClick={() => handleClick()} 
                            >
            <Icon icon='whatsapp' size={[24, 24]}></Icon>
            {message && <p className='p2-r' style={{color: 'white'}}>{message}</p>}
        </Button>
    )
}