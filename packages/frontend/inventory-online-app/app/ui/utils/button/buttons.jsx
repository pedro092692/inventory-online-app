import styles from'./page.module.css'

export function Button({text='Button', type='primary'}) {
    const textStyle = {
        primary: 'p1-b',
        secondary: 'p1-r',
        tertiary: 'p3-b',
        outline: 'p1-r',
        danger: 'p1-b',
        warning: 'p1-b',
        simple: 'p2-r',
        grey: 'p2-r'
    }

    if(!textStyle[type]) {
        type = 'primary'
    }

    return (
        <button className={`${styles.button} ${styles[type]} ${textStyle[type]}`}>
            {text}
        </button>
    )
}