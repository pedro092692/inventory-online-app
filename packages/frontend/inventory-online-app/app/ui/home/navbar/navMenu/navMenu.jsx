import Link from 'next/link'
import styles from '../page.module.css'

// Enlaces reales del nuevo diseño: 3 anclas dentro de la propia home.
export function NavMenu() {
    return (
        <>
            <Link href='/#beneficios' className={styles.navLink}>Beneficios</Link>
            <Link href='/#como-funciona' className={styles.navLink}>Cómo funciona</Link>
            <Link href='/#precio' className={styles.navLink}>Precio</Link>
        </>
    )
}
