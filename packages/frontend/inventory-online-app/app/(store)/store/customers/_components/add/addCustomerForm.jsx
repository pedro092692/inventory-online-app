'use client'
import AddCustomerAction from '@/app/lib/actions/customers/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function AddClientForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const [state, formAction, isPending] = useActionState(AddCustomerAction, initialState)
    const [field, setField] = useState({name: {isEdited: false,}, id_number: {isEdited: false}, phone: {isEdited: false}})
    const [phoneValue, setPhoneValue] = useState(state.inputs?.phone ?? '')


    const handleSubmit = (formData) => {
        if( !formData.get('name') || !formData.get('id_number') || !formData.get('cellphone')) return
        const formattedPhone = formData.get('cellphone')
        const cleaned = '+' +  formattedPhone.replace(/\D/g, '')
        formData.set('cellphone', cleaned)
        formAction(formData)
    }

     useEffect(() => {
        const success = state?.message
        if (success) {
            setPhoneValue('')
        }
    }, [state])

    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <Input type="text" icon="person" name={'name'}
                defaultValue={state.inputs?.name ?? ""}
                onChange={() => setField({...field, name: {isEdited: true}})}
                placeHolder='Nombre' 
                capitalize={true}
                />
            {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}
            
            <Input type="number" icon="id" name={'id_number'} placeHolder='Número de cedula'
                defaultValue={state.inputs?.id_number ?? ""}
                onChange={() => setField({...field, id_number: {isEdited: true}})}
            />
            {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}
            
            <Input type="phone" icon="phone"  name={'cellphone'} 
                value={phoneValue} 
                onChange={(e) => { setPhoneValue(e.target.value) } }
            />
            
            {state?.errors?.phone && <span className="field_error">{state?.errors?.phone}</span>}
            
            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Guardando...' : 'Guardar Cliente'} 
            </Button>
        </Form>
    )
}