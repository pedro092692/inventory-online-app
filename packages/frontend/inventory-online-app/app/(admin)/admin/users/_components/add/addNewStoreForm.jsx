'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function AddNewStoreForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const addStore = AddItemAction.bind(null, 'users/store', ['given_name', 
                                                              'last_name', 
                                                              'id_number',
                                                              'address',
                                                              'email',
                                                              'password',
                                                              'pin'], 'Nueva tienda creada con éxito')
    const [state, formAction, isPending] = useActionState(addStore, initialState)


    const handleSubmit = (formData) => {
        formAction(formData)
    }


    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <Input type="text" icon="person" name={'given_name'}
                defaultValue={state.inputs?.given_name ?? ""}
                placeHolder='Nombre del dueño' 
                capitalize={true}
                />
            {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

            <Input type="text" icon="paper" name={'last_name'}
                defaultValue={state.inputs?.last_name ?? ""}
                placeHolder='Apellido' 
                capitalize={true}
            />
            {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}
            
            <Input type="number" icon="id" name={'id_number'} placeHolder='Número de cedula'
                defaultValue={state.inputs?.id_number ?? ""}
            />
            {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}
            
            <Input type="text" icon="address" name={'address'}
                defaultValue={state.inputs?.address ?? ""}
                placeHolder='Dirección' 
                capitalize={true}
            />
            {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}

            <Input type="email" icon="mail" name={'email'}
                defaultValue={state.inputs?.email ?? ""}
                placeHolder='Email' 
                capitalize={false}
            />
            {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

            <Input type="password" icon="padlock" name={'password'}
                defaultValue={state.inputs?.password ?? ""}
                autocomplete={'new-password'}
                placeHolder='Contraseña' 
                capitalize={true}
            />
            {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}

            <Input type="password" icon="padlock" name={'pin'}
                        defaultValue={state.inputs?.pin ?? ""}
                        placeHolder='PIN Para Permisos' 
                        capitalize={true}
            />
            {state?.errors?.pin && <span className="field_error">{state?.errors?.pin}</span>}
            
        

            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.errors && typeof state.errors != 'object' && <span className="field_error">{state?.errors }</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            
            <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Creando Tienda...' : 'Crear Nueva Tienda'} 
            </Button>
        </Form>
    )
}