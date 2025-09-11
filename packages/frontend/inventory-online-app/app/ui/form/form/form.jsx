import styles from './form.module.css'
export function Form( {children, onSubmit} ) {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {children}
        </form>
    )
}