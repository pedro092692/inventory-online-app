'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import editCustomer from '@/app/lib/actions/customers/edit'
import { useActionState, useState } from 'react'

export default function CustomerDetailForm({customer}) {
    const customerOriginalData = { 
        name: customer?.name,
        id_number: customer?.id_number,
        phone: customer?.phone
    }

    const initialState = {message: null, errors: {}}
   
    const updateCustomer = editCustomer.bind(null, customer.id)
    const [state, formAction] = useActionState(updateCustomer, initialState)
    console.log(state)
    return (
        <>
            {customer &&
                <Form className={`${styles.formview} shadow`} action={formAction}>
                    <Input type="text" icon="person" defaultValue={state.inputs?.name ?? customer?.name} name={'name'} placeHolder='Nombre' />
                    {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}
                    <Input type="number" icon="id" defaultValue={`${customer?.id_number}`} name={'id_number'} />
                    {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}
                    <Input type="text" icon="phone" defaultValue={`${customer?.phone}`} name={'cellphone'} />
                    {state?.errors?.phone && <span className="field_error">{state?.errors?.phone}</span>}
                    <Button role="submit" type="secondary" >
                        Editar cliente
                    </Button>
                </Form>
            }
        </>
    )
}