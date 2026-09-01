'use client'
import { Logo } from '../../utils/logo'
import { Icon } from '../../utils/icons/icons'
import { MobileMenu } from './mobileMenu/mobileMenu'
import { LoginButton } from './loginButton/loginButton'
import { NavMenu } from './navMenu/navMenu'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

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
        <nav className={styles.navbar}>
            {/* logo + menu de escritorio */}
            <div className={styles.leftGroup}>
                <Link href='/' style={{height: '18px'}}>
                    <Logo />
                </Link>

                <div className={styles.menuButton}>
                    <NavMenu />
                </div>
            </div>

            {/* login, botón de precio y burger menu */}
            <div className={styles.rightGroup}>
                <div className={styles.menuButton}>
                    <LoginButton isLogged={isLogged} />
                    <Link href='/#precio'>
                        <span className={styles.priceButton}>Ver precio</span>
                    </Link>
                </div>

                <Icon onClick={() => setOpen(!open)} className={styles.segment} icon='segment' color='var(--color-neutralBlack)' />
            </div>

            {/* menu movil */}
            <MobileMenu open={open} setOpen={setOpen}>
                <LoginButton isLogged={isLogged} onClick={() => setOpen(false)}/>
            </MobileMenu>
        </nav>
    )
}
