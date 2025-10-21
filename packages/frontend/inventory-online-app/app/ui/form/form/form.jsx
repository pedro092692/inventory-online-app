import styles from './form.module.css'
export function Form( {children, onSubmit, style, className} ) {
    return (
        <form className={`${styles.form} ${className}`} onSubmit={onSubmit} style={style}>
            {children}
        </form>
    )
}