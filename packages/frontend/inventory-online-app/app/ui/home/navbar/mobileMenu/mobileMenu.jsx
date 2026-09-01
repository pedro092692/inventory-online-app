'use client'
import { Container } from '../../../utils/container'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

// Misma simplificación que en navMenu.jsx: en vez de 2 acordeones
// (Funciones/Ventajas) con submenús cruzados y enlaces muertos, se muestran
// directamente los 3 enlaces reales de la landing.
export function MobileMenu({open, setOpen, children}) {
    const menuRef = useRef(null)

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [open])

    useEffect(() => {
        function handleClickOutside(event) {
            if (open && menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [open, setOpen])

    if (!open) return null

    return (
        <Container
            ref={menuRef}
            className={styles.mobileMenu}
        >
            <Link href='/#beneficios' onClick={() => setOpen(false)}>
                <p className='p1-r' style={{cursor: 'pointer', textAlign: 'right'}}>Beneficios</p>
            </Link>
            <div className={styles.line}></div>

            <Link href='/#clientes' onClick={() => setOpen(false)}>
                <p className='p1-r' style={{cursor: 'pointer', textAlign: 'right'}}>Clientes</p>
            </Link>
            <div className={styles.line}></div>

            {children}
        </Container>
    )
}
