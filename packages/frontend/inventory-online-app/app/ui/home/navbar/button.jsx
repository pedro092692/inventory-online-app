import styles from './page.module.css'
export function Button({text}) {
    return (
        <button className={styles.button}>
            {text}
        </button>
    )
}