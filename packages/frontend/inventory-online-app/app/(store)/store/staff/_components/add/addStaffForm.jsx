'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'


export default function AddStaffForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const addStaff = AddItemAction.bind(
            null, 
            'sellers', 
            ['id_number', 'name', 'last_name', 'address', 'email', 'password', 'role_id', 'is_supervisor', 'pin'])
    
    const [state, formAction, isPending] = useActionState(addStaff, initialState)

    const handleSubmit = (formData) => {
        
    }

    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <Input type="text" icon="person" name={'name'}
                defaultValue={state.inputs?.name ?? ""}
                placeHolder='Nombre' 
                capitalize={true}
            />
            {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

            <Input type="text" icon="cashier" name={'last_name'}
                defaultValue={state.inputs?.last_name ?? ""}
                placeHolder='Apellido' 
                capitalize={true}
            />
            {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}

            <Input type="number" icon="id" name={'id_number'} placeHolder='Número de cedula'
                defaultValue={state.inputs?.id_number ?? ""}
            />
            {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

            <Input type="text" icon="person" name={'address'}
                defaultValue={state.inputs?.address ?? ""}
                placeHolder='Dirección' 
                capitalize={true}
            />
            {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}

            <Input type="email" icon="email" name={'email'}
                defaultValue={state.inputs?.email ?? ""}
                placeHolder='Email' 
                capitalize={true}
            />
            {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

            <Input type="password" icon="person" name={'password'}
                defaultValue={state.inputs?.password ?? ""}
                placeHolder='Contraseña' 
                capitalize={true}
            />
            {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}
        </Form>
    )
}