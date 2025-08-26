import styles from'./page.module.css'
import { Icon } from '../icons/icons'

export function Button({text='Button', type='primary', showIcon=false, icon='person', size=[20, 20]}) {
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

    let color = 'white'
    if(['outline', 'simple', 'grey'].includes(type)) {
        color = 'var(--color-neutralBlack)'
    }

    return (
        <button className={`${styles.button} ${styles[type]} ${textStyle[type]}`}>
            {showIcon && <Icon icon={icon} color={color} size={size}/>}
            {text}
        </button>
    )
}