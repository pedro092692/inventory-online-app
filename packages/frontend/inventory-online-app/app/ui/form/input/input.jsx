import styles from './input.module.css'
export function Input({type='text', placeHolder='default value', onChange, style}) {
    return (

        <input 
            className={`p2-r ${styles.input}`}
            type={type} 
            placeholder={placeHolder} 
            onChange={onChange}
            style={style}
            required
        />
    )
}