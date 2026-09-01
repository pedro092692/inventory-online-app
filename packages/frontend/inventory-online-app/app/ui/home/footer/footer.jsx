import { Logo } from '../../utils/logo'
import { Container } from '../../utils/container'
import Link from 'next/link'
import styles from './page.module.css'

// Antes había 4 columnas (Productos, Recursos, Empresa, Conecta) apuntando
// a páginas que no existen (/faq, /terms, /about, /whatsapp...) y que ni
// siquiera eran enlaces reales (solo texto suelto). La venta de Nexastock
// por ahora es en frío, directo con cada negocio, sin autoregistro ni canal
// de contacto por la web, así que se dejan solo los enlaces reales que ya
// existen en la app.
export function Footer() {

    const year = new Date().getFullYear()

    const footerLinks = [
        { title: 'Beneficios', link: '/#beneficios' },
        { title: 'Clientes', link: '/#clientes' },
    ]

    return (
        <footer className={`containerNexa ${styles.footer}`}>
            <Container
                className={styles.footerMenuContainer}
            >
                {/* brand logo */}
                <Logo type='iconWhite' />

                {/* enlaces reales de la landing */}
                <Container
                    padding='0px'
                    gap='24px'
                    justifyContent='start'
                    width='auto'
                >
                    {footerLinks.map((item, index) => (
                        <Link href={item.link} key={index}>
                            <p className={`p3-r ${styles.text}`} style={{cursor: 'pointer'}}>{item.title}</p>
                        </Link>
                    ))}
                </Container>
            </Container>
            <p className={`p3-r ${styles.text}`}>© {year} Nexastock – Todos los derechos reservados.  Impulsando el crecimiento de tu negocio con tecnología sencilla.  </p>
        </footer>

    )
}
