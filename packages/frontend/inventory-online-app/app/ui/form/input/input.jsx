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
        required=true,
        min=null,
        max=null,
        step=null,
        disable=false,
        patter=null,
        maxLength=null,
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
                    defaultValue={ value ?? defaultValue ?? ""}
                    name={name}
                    required={required}
                    readOnly={readOnly}
                    autoComplete={autocomplete}
                    autoFocus={autoFocus}
                    inputMode={inputMode}
                    accept={accept}
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disable}
                    pattern={patter}
                    maxLength={maxLength}
                />
        :
                <InputMask
                    className={`p2-r ${styles.input} ${className}`}
                    style={style_}
                    placeholder={'Teléfono'}
                    mask={'+58 9999-999-99-99'}
                    onChange={onChange}
                    // `defaultValue` only seeds InputMask once, at mount — it
                    // never re-applies on a later render, so a parent that
                    // resets its `value` state after the fact (e.g. clearing
                    // the phone field once a customer is saved) has no way
                    // to actually clear what's on screen or in the DOM
                    // (which is what a plain form submit reads). Every
                    // current caller of type="phone" already tracks its own
                    // state and wires both `value` and `onChange`, so making
                    // this properly controlled is safe and fixes the reset.
                    value={value ?? defaultValue ?? ""}
                    readOnly={readOnly}
                    name={name}
                    required={required}
                />
        }
        </Container>
    )
}