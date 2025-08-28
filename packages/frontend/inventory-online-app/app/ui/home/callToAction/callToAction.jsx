import { Button } from '../../utils/button/buttons'
import { Container } from '../../utils/container'

export function CallToAction() {
    return (
        <section className='container' style={{flexDirection: 'column', justifyContent:'start', gap:'24px'}}>
            <h2 className='h1'>
                Lleva tu negocio al siguiente nivel con Nexastock.
            </h2>

            {/* complement text */}
            <Container
                width='640px'
                padding='0px'
                justifyContent='center'
            >
                <p className='p1-r' style={{width: '452px'}}>Comienza a organizar tu inventario, vende más y ahorra tiempo en la gestión de tu empresa.</p>
                <Button type='secondary' icon='playArrow' showIcon={true} size={[13, 13]}>
                    Empieza hoy
                </Button>
            </Container>
            <img src="/images/home/nexastock_sofware.png" alt="nexastock software" />
        </section> 
    )
}