import Image from 'next/image'
import { Container } from '../../utils/container'

export function Customer() {
    return (
        <section className='container' style={{gap: '40px', alignItems: 'start'}}>
            <Container 
                gap='40px'
                padding='0px'
            >
                {/* image */}
                <img 
                    src={'/images/home/features.png'}
                    alt='features'
                />
                {/* text */}
                <Container
                    padding='0'
                    direction='column'
                    alignItem='start'
                    gap='16px'
                    width='656px'
                >
                    <h2 className='h1'>Tus clientes, siempre en el centro.</h2>
                    <Container
                    padding='0'
                    direction='column'
                    alignItem='start'
                    justifyContent='start'
                    gap='4px'
                    >
                        <p className='p1-b' style={{fontSize: '24px'}}>Descubre quiénes son tus mejores compradores</p>
                        <p className='p1-r'>Aumenta su fidelidad y haz crecer tus ventas con herramientas diseñadas para dar seguimiento a cada cliente.</p>
                    </Container>
                </Container>

            </Container>
        </section>
    )
}