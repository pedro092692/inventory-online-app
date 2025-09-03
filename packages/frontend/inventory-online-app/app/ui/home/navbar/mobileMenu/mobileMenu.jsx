'use client'
import React from 'react'
import { Container } from '../../../utils/container'
import { useEffect, useRef, useState } from 'react'
import { subMenuItems } from '../navMenu/subMenu/subMenu'
import Link from 'next/link'
import styles from './page.module.css'

export function MobileMenu({open, setOpen, children, showArrow=false}) {
    const [showDetail, setShowDetail] = useState(false)
    const [showDetail2, setShowDetail2] = useState(false)

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
                    onClick={() => setShowDetail(!showDetail)}
                >
                    <p className='p1-r' style={{cursor:'pointer', userSelect:'none'}}>Funciones</p>
                    {showArrow &&
                    <Image src='images/icons/arrowRight.svg'
                        width={18}
                        height={18}
                        alt='arrow right'
                    />
                    }
                    
                </Container>
                {/* submenu for functions */}
                {showDetail &&
                <Container
                    padding='0px'
                    alignItem='end'
                    direction='column'
                    gap='8px'
                    width='45%'
                >
                    {Object.keys(subMenuItems['functions']).map((key, index) => {
                        return (
                             <React.Fragment key={index}>
                                <Link href={subMenuItems['functions'][key].link} onClick={() => setOpen(false)}>
                                    <p className='p3-b' style={{textAlign: 'right'}}>{subMenuItems['functions'][key].title}</p>
                                </Link>
                                <div className={styles.line}></div>
                            </React.Fragment>
                        )
                    })}
                </Container>
                }

                <div className={styles.line}>

                </div>
                <Container
                    padding='0'
                    gap='4px'
                    onClick={() => setShowDetail2(!showDetail2)}
                >
                    <p className='p1-r' style={{cursor:'pointer', userSelect:'none'}}>Ventajas</p>
                    {showArrow &&
                    <Image src='images/icons/arrowRight.svg'
                        width={18}
                        height={18}
                        alt='arrow right'
                    />
                    }
                </Container>
                 {/* submenu for advantages */}
                {showDetail2 &&
                <Container
                    padding='0px'
                    alignItem='end'
                    direction='column'
                    gap='8px'
                    width='70%'
                >
                    {Object.keys(subMenuItems['advantages']).map((key, index) => {
                        return (
                             <React.Fragment key={index}>
                                <Link href={subMenuItems['advantages'][key].link} onClick={() => setOpen(false)}>
                                    <p className='p3-b' style={{textAlign: 'right'}}>{subMenuItems['advantages'][key].title}</p>
                                </Link>
                                <div className={styles.line}></div>
                            </React.Fragment>
                        )
                    })}
                </Container>
                }
                <div className={styles.line}></div>
                {children}
        </Container> 
    )
}