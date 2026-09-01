import Link from 'next/link'
import { Title } from '@/app/ui/dashboard/title/title'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'

export const metadata = {
    title: 'Página no encontrada',
}

// Lives inside the `store` segment, so Next.js picks this one — instead of
// the root app/not-found.jsx — for any unmatched URL under /store/*, and
// wraps it in app/(store)/layout.jsx, which renders the sidebar <Panel/>.
// Since middleware.ts already requires a valid session for every /store/*
// route, anyone who lands here is guaranteed to be logged in — this is the
// "logged-in" 404, with the dashboard chrome still in place.
export default function StoreNotFound() {
    return (
        <Container
            direction='column'
            alignItem='start'
            padding='0px'
            width='100%'
            gap='0px'
        >
            <Title title='Página no encontrada' icon='search' />

            <Container
                direction='column'
                justifyContent='center'
                alignItem='center'
                width='100%'
                flexGrow='1'
                gap='16px'
                padding='48px 24px'
            >
                <Icon icon='search' color='var(--color-neutralGrey600)' size={[80, 80]} />
                <h2 className='h3'>No encontramos esta página</h2>
                <p className='p2-r' style={{color: 'var(--color-neutralGrey700)', textAlign: 'center'}}>
                    Revisa el enlace o vuelve al panel principal.
                </p>
                <Link href='/store'>
                    <Button type='primary' showIcon={true} icon='circleArrow'>
                        Ir al panel
                    </Button>
                </Link>
            </Container>
        </Container>
    )
}
