import Image from 'next/image'
import { Container } from '@/app/ui/utils/container'

export function NavMenu({showArrow=true}) {
    return (
        <>
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
        </>
    )
}