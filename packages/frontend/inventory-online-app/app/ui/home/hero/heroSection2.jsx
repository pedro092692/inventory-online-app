import styles from './page.module.css'
import Image from 'next/image'
import { Container } from '../../utils/container.jsx'
import CircleIcon from '@/app/ui/utils/icons/circleIcon'
import { Icon } from '../../utils/icons/icons'

export function HeroTwo({}) {
    return (
        <section className={styles.hero2}>
            <Container
                padding={'40px'}
                flexGrow={'1'}
                className={styles.heroText}
                direction={'column'}
                gap={'24px'}
                justifyContent={'start'}
                alignItem={'start'}
                // backgroundColor={'red'}
            >
                {/* text */}
                <h1 className='h1'>
                   El software que te ayuda a <span style={{color: 'var(--color-blue700)'}}>vender más y administrar mejor</span> tu negocio.
                </h1>

                <p className='p1-r' style={{color: 'var(--color-neutralGrey900)'}}>Gestiona inventario, ventas, clientes y reportes desde la nube. Más control, mejores decisiones y más crecimiento.</p>

                {/* icons */}
                <Container
                    padding={'0px'}
                    justifyContent={'space-between'}
                    alignItem={'center'}
                    width={'100%'}
                    className={styles.iconWrapper}
                >
                    <CircleIcon 
                        icon='cloud'
                        title='100% en la nube'
                        text='accede desde cualquier lugar'
                    />

                    <CircleIcon 
                        icon='whatsapp'
                        title='Órdenes por WhatsApp'
                        text='Tus clientes compran más fácil'
                    />

                    <CircleIcon 
                        icon='shield'
                        title='Seguro y confiable'
                        text='Tus datos siempre protegidos'
                    />

                    <CircleIcon 
                        icon='report'
                        title='Reportes en tiempo real'
                        text='Toma mejores decisiones al instante'
                    />
                </Container>

                <p className='p3-r'>Calificado por negocios que crecen cada día mas de <span className='p3-b'>55 clientes ya confian en nosotros.</span></p>
            </Container>
            
            {/* image */}
            <Container
                className={styles.heroImg}
                padding={'0px'}
                flexGrow={'1'}
                children={''}
                justifyContent={'center'}
                alignItem={'center'}
            >
               <Image 
                   src='/images/home/hero_img_2.png'
                   height={715}
                   width={1011}
                  alt='Nexastock Software'
                 />
            </Container>
        </section>
    )
}