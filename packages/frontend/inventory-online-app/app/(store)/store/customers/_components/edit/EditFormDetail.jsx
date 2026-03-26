'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import editCustomer from '@/app/lib/actions/customers/edit'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function CustomerDetailForm({customer}) {
    const originalValues = {
        name: customer?.name,
        id_number: customer?.id_number,
        cellphone: customer?.phone
    }
    const initialState = {message: null, inputs: originalValues, errors: {}}
    const updateCustomer = EditItemAction.bind(null, `customers/${customer?.id}`, ['name', 'id_number', 'phone'], 'Cliente editado con éxito')
    const [state, formAction, isPending] = useActionState(updateCustomer, initialState)
    const [field, setField] = useState({name: {isEdited: false,}, id_number: {isEdited: false}, phone: {isEdited: false}})
    const [phoneValue, setPhoneValue] = useState(state.inputs?.phone ?? customer?.phone)
    
    const hasChanges = 
                field.name.isEdited ||
                field.id_number.isEdited ||
                field.phone.isEdited
    
    
    const handleSubmit = (formData) => {
        if(!hasChanges) return 
        const formattedPhone = formData.get('phone') || ''
        const cleaned = '+' +  formattedPhone.replace(/\D/g, '')
        formData.set('phone', cleaned)

        return formAction(formData)

    }

    useEffect(() => {
        const success = state?.message
        if (success) {
            setField({
                name: {isEdited: false},
                id_number: {isEdited: false},
                phone: {isEdited: false}
            })
        }
    }, [state]) 

    return (
        <>
            {customer &&
                <Form className={`${styles.formview} shadow`} action={handleSubmit}  >
                    <Input type="text" icon="person" defaultValue={state.inputs?.name ?? customer?.name} name={'name'}
                        capitalize={true}
                        onChange={() => setField({...field, name: {isEdited: true}})}
                        placeHolder='Nombre' 
                        />
                    {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}
                    
                    <Input type="number" icon="id" defaultValue={state.inputs?.id_number ?? customer?.id_number} name={'id_number'} 
                        onChange={() => setField({...field, id_number: {isEdited: true}})}
                    />
                    {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}
                    
                    <Input type="phone" icon="phone" value={phoneValue} name={'phone'} 
                        onChange={(e) => { setPhoneValue(e.target.value) 
                                           setField({...field, phone: {isEdited: true}}) 
                        }}
                    />
                    
                    {state?.errors?.phone && <span className="field_error">{state?.errors?.phone}</span>}
                    
                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
                    
                    <Button role="submit" type="secondary" disabled={isPending} style={{cursor: hasChanges ? 'pointer': 'auto'}}>
                         {isPending && <OvalLoader/>}   
                         {isPending ? 'Guardando...' : 'Editar Cliente'} 
                    </Button>
                </Form>
            }
        </>
    )  
}