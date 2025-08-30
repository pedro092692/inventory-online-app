import { Logo } from '../../utils/logo'
import { Container } from '../../utils/container'
import styles from './page.module.css'

export function Footer() {

    const year = new Date().getFullYear()
    const footerMenu = {

        products: {
            title: 'Productos',
            items: ['Funciones', 'Ventajas', 'Precios', 'Demo en línea'],
            link: ['/function', '/benefits', '/price', '/demo']
        },

        resourser: {
            title: 'Recursos',
            items: ['Ayuda', 'Preguntas frecuentes', 'Guías', 'Contacto'],
            link: ['/help', '/faq', '/guides', '/contact']
        },

        enterprise: {
            title: 'Empresa',
            items: ['Sobre Nosotros', 'Términos y condiciones', 'Política de privacidad', 'Soporte'],
            link: ['/about', '/terms', '/privacy', '/support']       
        },

        connects: {
            title: 'Conencta',
            items: ['WhatsApp', 'Correo electrónico', 'Instagram'],
            link: ['/whatsapp', '/email', '/instagram']
        }
    }

    return (
        <footer className={`container ${styles.footer}`}>
            <Container
                className={styles.footerMenuContainer}
            >  
                {/* brand logo */}
                <Logo  type='iconWhite' />
                
                {/* render footer menu */}
                {Object.keys(footerMenu).map((key, index) => {
                    return (
                        <Container
                            className={styles.menuItem}
                            direction='column'
                            alignItem='start'
                            justifyContent='start'
                            padding='0px'
                            gap='10px'
                            width='100%'
                            key={index}
                        >
                            <p className={`p3-b ${styles.text}`}>{footerMenu[key].title}</p>
                            <div className={styles.line}></div>
                            {footerMenu[key].items.map((item, index) => {
                                return (
                                    <p className={`p3-r ${styles.text}`} key={index}>{item}</p>
                                )
                            })}

                        </Container>
                    )
                })}
            </Container>
            <p className={`p3-r ${styles.text}`}>© {year} Nexastock – Todos los derechos reservados.  Impulsando el crecimiento de tu negocio con tecnología sencilla.  </p>
        </footer>

    )
}