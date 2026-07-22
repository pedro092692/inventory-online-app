'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import InputStyles from '@/app/ui/form/input/input.module.css'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect, useRef } from 'react'

export default function AddCurrencyValueForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const addCustomer = AddItemAction.bind(null, 'dollar-value', ['value'], 'Valor agregado con éxito')
    const [value, setValue] = useState('0.00')
    const inputRef = useRef(null)
    const [state, formAction, isPending] = useActionState(addCustomer, initialState)

    const handleSubmit = (formData) => {
        if( !formData.get('value') ) return
        
        const newValue = parseFloat(value)
        formData.value = newValue
        formAction(formData)
    }

    const handleInputChange = (e) => {
        let raw = e.target.value.replace(/\D/g, "")
        if (raw === "") raw = "0"
        const number = (parseInt(raw, 10) / 100).toFixed(2)

        setValue(number)
    }

    useEffect(() => {
        if (inputRef.current) {
            const len = inputRef.current.value.length
            inputRef.current.setSelectionRange(len, len);
        }
    }, [value])

    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <Container
                padding={'0px 0px 0px 16px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                width='100%'
                gap={'0px'}
                borderRadius='8px'
                justifyContent='start'
            >
                <Icon icon={'dollar'} color='black'/>
                <input type="text" 
                    value={state.inputs?.value ?? value} onChange={handleInputChange} 
                    className={`p2-r ${InputStyles.input}`}
                    name={'value'}
                    autoFocus={true}
                    ref={inputRef}
                />
            </Container>

            
            {state?.errors?.value && <span className="field_error">{state?.errors?.value}</span>}
            
            
            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Guardando...' : 'Guardar valor de divisa'} 
            </Button>
        </Form>
    )
}