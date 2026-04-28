'use client'
import styles from './input.module.css'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import InputMask from 'comigo-tech-react-input-mask'

export function Input({
        type='text', 
        placeHolder='default value', 
        onChange, 
        style, 
        backgroundColor, 
        showIcon=true, 
        icon='playArrow', 
        gap='0px', 
        className='', 
        value, 
        name,  
        readOnly=false,
        autocomplete='off',
        autoFocus=false,
        capitalize=false,
        inputMode=null,
        defaultValue=null,
        accept=null,
        id=null,

    }) {
    const style_ = {...style, backgroundColor: `var(${backgroundColor})`, padding: showIcon ? '0px 0px 0px 8px' : '0px 0px 0px 16px', width: '100%', textTransform: capitalize ? 'capitalize' : 'none'}
  
    return (
        <Container
            padding={showIcon ? '0px 0px 0px 16px' : '0px'}
            backgroundColor={backgroundColor ?`var(${backgroundColor})` : 'var(--color-neutralGrey300)'}
            width='100%'
            gap={gap}
            borderRadius='8px'
            justifyContent='start'
        >
            {showIcon && <Icon icon={icon} color='black'/>}
            {type != 'phone'? 
                <input 
                    // className={`p2-r ${styles.input}` + (className ? className : '')}
                    className={`p2-r ${styles.input} ${className}`}
                    type={type} 
                    placeholder={placeHolder} 
                    onChange={onChange}
                    style={style_}
                    defaultValue={value ?? defaultValue ?? ""}
                    name={name}
                    required
                    readOnly={readOnly}
                    autoComplete={autocomplete}
                    autoFocus={autoFocus}
                    inputMode={inputMode}
                    accept={accept}
                    id={id}
                />
        :
                <InputMask
                    className={`p2-r ${styles.input} ${className}`}
                    style={style_}
                    placeholder={'Teléfono'}
                    mask={'+58 9999-999-99-99'}
                    onChange={onChange}
                    defaultValue={value ?? defaultValue ?? ""}
                    readOnly={readOnly}  
                    name={name}
                />
        }
        </Container>
    )
}