import styles from './page.module.css'
import Image from 'next/image'
import Link from 'next/link'

export function BrandMenu() {
    
    return (
        <div className={styles.brandMenu}>
            {/* logo */}
            <Link href="/">
                <Image 
                    src="/images/home/logo.svg"
                    width={190}
                    height={24}
                    loading="lazy"
                    alt="Next.js Logo"
                />
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