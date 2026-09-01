import Link from 'next/link'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'
import { Navbar } from '@/app/ui/home/navbar/navbar'
import { Footer } from '@/app/ui/home/footer/footer'

export const metadata = {
    title: 'Página no encontrada',
}

// Root-level 404: Next.js falls back to this one for any URL que no
// coincide con ninguna ruta y no tiene un not-found.jsx más cercano (ver
// app/(store)/store/not-found.jsx para la versión con sesión iniciada,
// envuelta en el panel del dashboard). Este archivo se queda en la raíz
// (no lo movemos a (home)) porque es el único lugar que captura de forma
// confiable una URL que no coincide con ninguna ruta en absoluto; en vez
// de moverlo, reutilizamos aquí el mismo <Navbar/> y <Footer/> que usa
// app/(home)/layout.jsx para que se vea igual.
export default function NotFound() {
    return (
        <>
            <Navbar />
            <div style={{flexGrow: '1', display: 'flex'}}>
                <Container
                    direction='column'
                    justifyContent='center'
                    alignItem='center'
                    width='100%'
                    flexGrow='1'
                    gap='24px'
                    padding='24px'
                >
                    <Icon icon='search' color='var(--color-neutralGrey600)' size={[96, 96]} />

                    <Container direction='column' padding='0px' gap='8px' alignItem='center'>
                        <h1 className='h1'>404</h1>
                        <h2 className='h3'>No encontramos esta página</h2>
                        <p className='p2-r' style={{color: 'var(--color-neutralGrey700)', textAlign: 'center'}}>
                            Puede que el enlace esté roto o que la página se haya movido.
                        </p>
                    </Container>

                    <Link href='/'>
                        <Button type='primary' showIcon={true} icon='circleArrow'>
                            Volver al inicio
                        </Button>
                    </Link>
                </Container>
            </div>
            <Footer />
        </>
    )
}
