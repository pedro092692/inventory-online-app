'use client'
import { Container } from '../../../utils/container'
import { useEffect, useRef } from 'react'
import { LoginButton } from '../loginButton/loginButton'
import styles from './page.module.css'

export function MobileMenu({open, setOpen, children, showArrow=false}) {
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
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [open, setOpen])

     if (!open) return null

    return (
        <Container 
            ref={menuRef}
            className={styles.mobileMenu}
        >
               <Container
                    padding='0'
                    gap='4px'
                >
                    <p className='p1-r' style={{cursor:'pointer'}}>Funciones</p>
                    {showArrow &&
                    <Image src='images/icons/arrowRight.svg'
                        width={18}
                        height={18}
                        alt='arrow right'
                    />
                    }
                </Container>
                <div className={styles.line}>

                </div>
                <Container
                    padding='0'
                    gap='4px'
                >
                    <p className='p1-r' style={{cursor:'pointer'}}>Ventajas</p>
                    {showArrow &&
                    <Image src='images/icons/arrowRight.svg'
                        width={18}
                        height={18}
                        alt='arrow right'
                    />
                    }
                </Container>
                <div className={styles.line}></div>
                {children}
        </Container> 
    )
}