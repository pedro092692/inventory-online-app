import styles from './page.module.css'
export function Button({text, color="blue800"}) {
    return (
        <button className={styles.button} style={{backgroundColor: `var(--color-${color})`,}}>
            {text}
        </button>
    )
}