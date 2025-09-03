import { Container } from '@/app/ui/utils/container'
import styles from '../menu.module.css'
import Image from 'next/image'
import Link from 'next/link'


export function SubMenu ({type = 'advantages', open=false}) {
    const subMenu = {
        advantages: {
            1: {
                title: 'Gestión de inventario en la nube',
                link: '/'
            },

            2: {
                title: 'Métricas inteligentes',
                link: '/'
            }, 
            
            3: {
                title: 'Órdenes de compra por WhatsApp',
                link: '/'
            },

            4: {
                title: 'Seguimiento de clientes',
                link: '/'
            }
        }, 

        functions: {
            1: {
                title: 'Bajo Costo',
                link: '/',
                icon: 'dollar'
            },

            2: {
                title: 'Fácil de usar',
                link: '/',
                icon: 'playArrow'
            },

            3: {
                title: 'Optimiza tu tiempo',
                link: '/',
                icon: 'plus1'
            }

        }
    }
    
    if (!open) return null

    return (
        
        <Container className={`shadow ${styles.subMenu}`}
        >
            {Object.keys(subMenu[type]).map((key, index) => {
                return (
                    <Link href={subMenu[type][key].link} key={index} style={{width: '100%'}}>
                        <Container
                            className={styles.subMenuItem}
                            key={index}
                        >   
                            <p className='p3-b'>
                                {subMenu[type][key].title}
                            </p>
                            <Image src='images/icons/arrowRight.svg'
                                width={18}
                                height={18}
                                alt='arrow right'
                            />
                        </Container>
                    </Link>
                )
            })}
        </Container>
    )
}