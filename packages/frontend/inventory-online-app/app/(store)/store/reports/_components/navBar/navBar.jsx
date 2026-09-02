
'use client'
import { usePathname } from 'next/navigation'
import { Container } from "@/app/ui/utils/container"
import { Button } from "@/app/ui/utils/button/buttons"
import Link from 'next/link'
import styles from './navBar.module.css'

export default function NavReports({canViewAudit = false}) {
    const pathname = usePathname()
    const segments = pathname.split('/')
    const currentEndpoint = segments[3]

    const reportsButtons = [
        {
            label: 'Ventas',
            icon: 'dollar',
            endpoint: 'sales',
            link: '/store/reports/sales',
        },
        {
            label: 'Productos',
            icon: 'boxes',
            endpoint: 'products',
            link: '/store/reports/products',
        },
        {
            label: 'Clientes',
            icon: 'person',
            endpoint: 'customers',
            link: '/store/reports/customers',
        },
        ...(canViewAudit ? [{
            label: 'Auditoría',
            icon: 'shield',
            endpoint: 'audit',
            link: '/store/reports/audit',
        }] : []),
    ]

    return (
        <Container
            padding={'16px'}
            width={'100%'}
            className={`shadow-sm ${styles.navRow}`}
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
        >
            {
                reportsButtons.map((button, index) => {
                    const isActive = button.endpoint == currentEndpoint
                    return (
                        <Link key={index+button.label} href={`${button.link}`}>
                            <Button 
                                key={index}
                                type={'secondary'}
                                icon={button.icon}
                                showIcon={true}
                                children={button.label}
                                className={isActive ? 'shadow' : ''}
                                style={{ backgroundColor: isActive ? '' : '#5C6572' }}
                            />
                        </Link>
                    )
                })
            }
            
        </Container>
    )
}