import styles from './form.module.css'
export function Form( {children, onSubmit, style, className, action = false} ) {
    return (
        <form className={`${styles.form} ${className}`} onSubmit={onSubmit} style={style} action={action ? action : ''}>
            {children}
        </form>
    )
}