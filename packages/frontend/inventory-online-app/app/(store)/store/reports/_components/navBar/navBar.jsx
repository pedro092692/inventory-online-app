
'use client'
import { usePathname } from 'next/navigation'
import { Container } from "@/app/ui/utils/container"
import { Button } from "@/app/ui/utils/button/buttons"
import Link from 'next/link'

export default function NavReports() {
    const pathname = usePathname().split('/')
    const endpoint = pathname[pathname.length - 1] 
    console.log(endpoint)
    const reportsButtons = [
        {
            label: 'Clientes',
            icon: 'person',
            endpoint: 'reports',
            link: '/store/reports',
        },
        {
            label: 'Productos',
            icon: 'boxes',
            endpoint: 'products',
            link: '/store/reports/products',
        },
        {
            label: 'Ventas',
            incon: 'dollar',
            endpoint: 'sales',
            link: '/store/reports/sales',
        }
    ]

    return (
        <Container
            padding={'16px'}
            width={'100%'}
            alignItem={'center'}
            justifyContent={'start'}
            className='shadow-sm'
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
        >
            {
                reportsButtons.map((button, index) => {
                    return (
                        <Link key={index+button.label} href={`${button.link}`}>
                            <Button 
                                key={index}
                                type={'secondary'}
                                icon={button.icon}
                                showIcon={true}
                                children={button.label}
                                className={endpoint != button.endpoint ? '' : 'shadow'}
                                style={{backgroundColor: endpoint != button.endpoint ? '#5C6572' : ''}}
                            />
                        </Link>
                    )
                })
            }
            
        </Container>
    )
}