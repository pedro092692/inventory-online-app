import styles from './form.module.css'
import { forwardRef } from 'react'

export const Form = forwardRef(function Form(
    { children, onSubmit, style, className, action = false, autoComplete = "on" }, ref
) {
    return (
        <form ref={ref} className={`${styles.form} ${className}`} onSubmit={onSubmit} style={style} action={action ? action : ''} autoComplete={autoComplete}>
            {children}
        </form>
    )
})