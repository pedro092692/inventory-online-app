'use client'
import { Container } from '../../utils/container'
import { Logo } from '../../utils/logo'
import { Icon } from '../../utils/icons/icons'
import { MobileMenu } from './mobileMenu/mobileMenu'
import { LoginButton } from './loginButton/loginButton'
import { NavMenu } from './navMenu/navMenu'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export function Navbar() {
    const [isLogged, setIsLogged] = useState(false)
    const [open, setOpen] = useState(false)
   
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
                padding='0px'
                height={'100%'}
                gap='16px'
                justifyContent='start'
                flexGrow='1'
                >

                    <NavMenu />

            </Container>
            
            {/* login button and burge menu */}
            <Container 
                className={styles.menuContainer}
            >

                <LoginButton isLogged={isLogged} className={styles.menuButton}/>
            
                {/* burger menu */}
                <Icon onClick={() => setOpen(!open)} className={styles.segment} icon='segment' color='var(--color-neutralBlack)'
                    
                />
            </Container>
            
            {/* moible menu */}
            <MobileMenu open={open} setOpen={setOpen}>
                <LoginButton isLogged={isLogged} onClick={() => setOpen(false)}/>
            </MobileMenu>
        </nav>
    )
}