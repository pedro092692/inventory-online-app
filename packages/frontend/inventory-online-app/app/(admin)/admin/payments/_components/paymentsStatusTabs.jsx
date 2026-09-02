'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'

const TABS = [
    { label: 'Pendientes', value: 'pending' },
    { label: 'Aprobados', value: 'approved' },
    { label: 'Rechazados', value: 'rejected' },
    { label: 'Todos', value: 'all' }
]

export default function PaymentsStatusTabs() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentStatus = searchParams.get('status') || 'pending'

    const handleClick = (status) => {
        const params = new URLSearchParams(searchParams)
        params.set('status', status)
        params.set('page', '1')
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Container
            padding={'16px'}
            width={'100%'}
            alignItem={'center'}
            justifyContent={'start'}
            className='shadow-sm'
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            flexWrap={'wrap'}
        >
            {
                TABS.map((tab) => {
                    const isActive = tab.value === currentStatus
                    return (
                        <Button
                            key={tab.value}
                            type={'secondary'}
                            children={tab.label}
                            className={isActive ? 'shadow' : ''}
                            style={{ backgroundColor: isActive ? '' : '#5C6572' }}
                            onClick={() => handleClick(tab.value)}
                        />
                    )
                })
            }
        </Container>
    )
}
