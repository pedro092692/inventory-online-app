import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '../../utils/logo'

export function BrandMenu() {
    
    return (
        <div className={styles.brandMenu}>
            {/* logo */}
            <Link href="/">
                <Logo  />
            </Link>
            {/* menu */}
            <div className={styles.menu}>
                <ul>
                    <li>
                        Funcionalidades
                    </li>
                    <li>
                        Ventajas
                    </li>
                </ul>
            </div>
        </div>
    )
}