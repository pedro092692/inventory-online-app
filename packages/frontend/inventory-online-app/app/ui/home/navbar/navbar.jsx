'use client'
import { Container } from '../../utils/container'
import styles from './page.module.css'
import { Logo } from '../../utils/logo'
import { Button } from '../../utils/button/buttons'
import { Icon } from '../../utils/icons/icons'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export function Navbar() {
    const [isLogged, setIsLogged] = useState(false)
    
    useEffect(() => {
        const checkLogin = async () => {
        try {
            await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/api/security/isLogged`,
            {},
            { withCredentials: true }
        )
            setIsLogged(true)
        }catch {
            setIsLogged(false)
            }
        }
        checkLogin()
    }, [])

    return (
        <nav className={`container ${styles.navbar}`}>
            {/* company logo */}
            <Logo />

            {/* main menu */}
            <Container 
                className={styles.menuButton}
                padding='10px'
                gap='16px'
                justifyContent='start'
                flexGrow='1'>
                    <Container
                        padding='0'
                        gap='4px'
                    >
                        <p className='p1-r' style={{cursor:'pointer'}}>Funciones</p>
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
                        <p className='p1-r' style={{cursor:'pointer'}}>Ventajas</p>
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
                    <Link href={isLogged ? '/products' : '/login'} className={styles.menuButton}>
                        <Button type='secondary' showIcon={true} icon={isLogged ? 'store' : 'login'} size={isLogged ? [20, 20] : [13.33, 13.33]} className='p2-r'>
                            {isLogged ? 'Mi Negocio' : 'Iniciar Sesión'}
                        </Button>
                    </Link>
            
                {/* burger menu */}
                <Icon className={styles.segment}  icon='segment' color='var(--color-neutralBlack)'/>
            </Container>

        </nav>
    )
}