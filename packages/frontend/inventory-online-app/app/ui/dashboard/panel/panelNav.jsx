'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../../utils/icons/icons'
import styles from './panel.module.css'
import LogoutAction from '@/app/lib/actions/logout'

export function PanelNav({items, type}) {
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : 'auto'
    }, [open])

    useEffect(() => {
        function handleClickOutside(event) {
            if (open && panelRef.current && !panelRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
        <>
            {/* barra superior, solo visible en pantallas pequeñas */}
            <div className={styles.topbar}>
                <Link href={type === 'store' ? '/store' : '/admin'}>
                    <Logo type='logoWhite' style={{height: '22px'}}/>
                </Link>
                <Icon
                    onClick={() => setOpen(!open)}
                    className={styles.burger}
                    icon='segment'
                    color='var(--color-neutralWhite)'
                />
            </div>

            {/* fondo oscuro detras del menu cuando esta abierto en movil */}
            {open && <div className={styles.backdrop} onClick={() => setOpen(false)}></div>}

            <Container ref={panelRef} className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
                {/* logo */}
                <Link href={`${type === 'store' ? '/store' : '/admin'}`} className={styles.logoLink}>
                    <Logo type='logoWhite' style={{width: '100%'}}/>
                </Link>
                {/* menu container */}
                <Container className={styles.menu}>
                    {/* render menu */}
                    {items.map((item, index) => (
                        <Link key={index} href={item.link} style={{width: '100%'}} onClick={() => setOpen(false)}>
                            <Container className={`p2-r ${styles.menuItem}`}>
                                <p>{item.title}</p>
                                <Icon icon={item.icon}/>
                            </Container>
                        </Link>
                    ))}
                </Container>
                {/* logout */}
                <form action={LogoutAction} style={{width: '100%'}}>
                    <button
                        type="submit"
                        className={`p2-r ${styles.menuItem} ${styles.logoutButton}`}
                    >
                        <p>Cerrar sesión</p>
                        <Icon icon='logout'/>
                    </button>
                </form>
            </Container>
        </>
    )
}
