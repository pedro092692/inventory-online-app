'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import FloatInput from '@/app/ui/form/input/floatInput'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState } from 'react'

export default function AddCurrencyValueForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const addCustomer = AddItemAction.bind(null, 'dollar-value', ['value'], 'Valor agregado con éxito')
    const [state, formAction, isPending] = useActionState(addCustomer, initialState)

    const handleSubmit = (formData) => {
        if( !formData.get('value') ) return
        
        const newValue = parseFloat(value)
        formData.value = newValue
        formAction(formData)
    }

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
                <FloatInput valueInput={state.inputs?.value ?? false} />
            </Container>

            {state?.errors?.value && <span className="field_error">{state?.errors?.value}</span>}
            
            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.errors && typeof state.errors != 'object' && <span className="field_error">{state?.errors }</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Guardando...' : 'Guardar valor de divisa'} 
            </Button>
        </Form>
    )


}

// export {floatInput}