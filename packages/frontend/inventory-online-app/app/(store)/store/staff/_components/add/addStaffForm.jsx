'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import Select from '@/app/ui/select/select'
import styles from '@/app/(store)/store/customers/add/input.module.css'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'


export default function AddStaffForm() {
    
    const initialState = {message: null, inputs: {}, errors: {}}
    const [roleId, setRoleId] = useState(4)
    const addStaff = AddItemAction.bind(
            null, 
            'sellers', 
            ['id_number', 'name', 'last_name', 'address', 'email', 'password', 'role_id', 'is_supervisor', 'pin'],
            'Personal Agregado con éxito'
        )
    
    const [state, formAction, isPending] = useActionState(addStaff, initialState)

    const handleSubmit = (formData) => {

        if (roleId === 3) {
            formData.append('is_supervisor', true)
        }
        
        formAction(formData)
    }

    useEffect(() => {
        const success = state?.message
        if (success) {
            setRoleId(4)
        }
    }, [state])

    return (
        <Form className={`${styles.form} shadow`} action={handleSubmit}>
            <Input type="text" icon="person" name={'name'}
                defaultValue={state.inputs?.name ?? ""}
                placeHolder='Nombre' 
                capitalize={true}
                required={false}
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
            />
            {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

            <Input type="password" icon="padlock" name={'password'}
                defaultValue={state.inputs?.password ?? ""}
                placeHolder='Contraseña' 
                capitalize={true}
            />
            {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}

            <label htmlFor="role_id">Rol de usuario:</label>        
            
            <Select 
                name='role_id' 
                options={[{value: 4, label: 'Cajero'}, {value: 3, label: 'Supervisor'}]}
                value={roleId}
                onChange={(role) => setRoleId(role.value)}
                disabled={false}
            />

            {
                roleId == 3 && (
                    <>
                        <Input type="password" icon="padlock" name={'pin'}
                        defaultValue={state.inputs?.pin ?? ""}
                        placeHolder='PIN Para Permisos' 
                        capitalize={true}
                        />
                        {state?.errors?.pin && <span className="field_error">{state?.errors?.pin}</span>}
                    </>
                    
                )
                
            }
           
            {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

            {state?.errors && typeof state.errors != 'object' && <span className="field_error">{state?.errors }</span>}

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

            <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Guardando...' : 'Guardar Personal'} 
            </Button>
        </Form>
    )
}