
'use client'
import { usePathname } from 'next/navigation'
import { Container } from "@/app/ui/utils/container"
import { Button } from "@/app/ui/utils/button/buttons"
import Link from 'next/link'

export default function SalesNavbar() {
    const pathname = usePathname().split('/')
    const endpoint = pathname[pathname.length - 1] 
    const buttons = [
        {
            label: 'Resumen',
            endpoint: 'sales',
            link: '/store/reports/sales',
        },
        {
            label: 'Patrones',
            endpoint: 'patterns',
            link: '/store/reports/sales/patterns',
        },
    ]
    
    return (
        <Container
            padding={'0px'}
            width={'100%'}
            alignItem={'center'}
            justifyContent={'start'}
            borderRadius={'8px'}
        >
          
            {
                buttons.map((button, index) => {
                    return (
                        <Link key={index+button.label} href={`${button.link}`}>
                            <Button 
                                key={index}
                                type={endpoint != button.endpoint ? 'simple' : 'secondary'}
                                children={button.label}
                                className={endpoint != button.endpoint ? '' : 'shadow'}
                            />
                        </Link>
                    )
                })
            }
            
        </Container>
    )
}