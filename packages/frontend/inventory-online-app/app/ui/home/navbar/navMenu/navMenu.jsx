'use client'
import Image from 'next/image'
import { Container } from '@/app/ui/utils/container'
import { SubMenu } from './subMenu/subMenu'
import styles from './menu.module.css'
import { useState } from 'react'


export function NavMenu({showArrow=true}) {
    const [showMenu, setShowMenu] = useState(false)
    const [showMenu2, setShowMenu2] = useState(false)
    return (
        <>
            <Container
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
                className={styles.menu}
                padding='0'
                gap='4px'
                height={'100%'}
            >
                <p className='p1-r' style={{cursor:'pointer'}}>Funciones</p>
                {showArrow &&
                <Image src='images/icons/arrowRight.svg'
                    width={18}
                    height={18}
                    alt='arrow right'
                />
                }

                <SubMenu open={showMenu}/>

            </Container>

            <Container
                onMouseEnter={() => setShowMenu2(true)}
                onMouseLeave={() => setShowMenu2(false)}
                className={styles.menu}
                padding='0'
                gap='4px'
                height={'100%'}
            >
                <p className='p1-r' style={{cursor:'pointer'}}>Ventajas</p>
                {showArrow &&
                <Image src='images/icons/arrowRight.svg'
                    width={18}
                    height={18}
                    alt='arrow right'
                />
                }
                <SubMenu type='functions' open={showMenu2}/>
            </Container>
        </>
    )
}