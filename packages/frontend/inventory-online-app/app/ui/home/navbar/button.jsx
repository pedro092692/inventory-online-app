import styles from './page.module.css'
import Link from 'next/link'
export function Button({text, color="blue800"}) {
    return (
        <Link href={"/login"}>
            <button className={styles.button} style={{backgroundColor: `var(--color-${color})`,}}>
                {text}
            </button>
        </Link>
    )
}