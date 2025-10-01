import styles from './form.module.css'
export function Form( {children, onSubmit, style} ) {
    return (
        <form className={styles.form} onSubmit={onSubmit} style={style}>
            {children}
        </form>
    )
}