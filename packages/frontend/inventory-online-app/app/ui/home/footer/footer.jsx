import { Logo } from '../../utils/logo'
import Link from 'next/link'
import styles from './page.module.css'

export function Footer() {

    const year = new Date().getFullYear()

    const footerLinks = [
        { title: 'Beneficios', link: '/#beneficios' },
        { title: 'Cómo funciona', link: '/#como-funciona' },
        { title: 'Precio', link: '/#precio' },
    ]

    return (
        <footer className={styles.footer}>
            <Logo />

            <div className={styles.links}>
                {footerLinks.map((item, index) => (
                    <Link href={item.link} key={index} className={styles.link}>{item.title}</Link>
                ))}
            </div>

            <div className={styles.copyright}>© {year} Nexastock</div>
        </footer>
    )
}
