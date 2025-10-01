import styles from './input.module.css'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
export function Input({type='text', placeHolder='default value', onChange, style, backgroundColor, showIcon=true, icon='playArrow', gap='0px'}) {
    const style_ = {...style, backgroundColor: `var(${backgroundColor})`, padding: showIcon ? '0px 0px 0px 8px' : '0px 0px 0px 16px'}
    return (
        <Container
            padding={showIcon ? '0px 0px 0px 16px' : '0px'}
            backgroundColor={`var(${backgroundColor})`}
            width='100%'
            gap={gap}
            borderRadius='8px'
            justifyContent='start'
            
        >
            {showIcon && <Icon icon={icon} color='black'/>}
            <input 
                className={`p2-r ${styles.input}`}
                type={type} 
                placeholder={placeHolder} 
                onChange={onChange}
                style={style_}
                required
            />
        </Container>
    )
}