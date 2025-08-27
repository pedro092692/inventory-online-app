import { Container } from '../../utils/container'
import styles from './page.module.css'
import { Logo } from '../../utils/logo'
import { Button } from '../../utils/button/buttons'
import Image from 'next/image'
import Link from 'next/link'

export function Navbar() {
    
    return (
        <nav className={`container ${styles.navbar}`}>
            {/* company logo */}
            <Logo />

            {/* main menu */}
            <Container 
                padding='10px'
                gap='16px'
                justifyContent='start'
                flexGrow='1'>
                    <Container
                        padding='0'
                        gap='4px'
                    >
                        <p className='p1-r'>Funciones</p>
                        <Image src='images/icons/arrowRight.svg'
                            width={18}
                            height={18}
                            alt='arrow right'
                        />
                    </Container>
                    <Container
                        padding='0'
                        gap='4px'
                    >
                        <p className='p1-r'>Ventajas</p>
                        <Image src='images/icons/arrowRight.svg'
                            width={18}
                            height={18}
                            alt='arrow right'
                        />
                    </Container>
            </Container>
            {/* login button */}
            <Container 
                padding='10px'
                gap='16px'
                justifyContent='end'
                flexGrow='1'>
                    <Link href={'/login'}>
                        <Button type='grey' showIcon={true} icon='person' size={[13.33, 13,33]}>
                            Iniciar Sesion
                        </Button>
                    </Link>
            </Container>
        </nav>
    )
}