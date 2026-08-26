'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState } from 'react'

export default function StoreOwnerDetailForm({user, seller}) {
    const originalValues = {
        email: user?.email,
        name: seller?.name,
        last_name: seller?.last_name,
        id_number: seller?.id_number,
        address: seller?.address,
    }
    const initialState = {message: null, inputs: originalValues, errors: {}}

    const updateStoreOwner = EditItemAction.bind(null, `users/storeOwner/${user?.id}`,
        ['email', 'password', 'name', 'last_name', 'id_number', 'address'],
        'Tienda editada con éxito')

    const [state, formAction, isPending] = useActionState(updateStoreOwner, initialState)

    return (
        <>
            {user &&
                <Form className={`${styles.formview} shadow`} action={formAction}>
                    <Input type="email" icon="mail" name={'email'}
                        defaultValue={state.inputs?.email ?? user?.email}
                        placeHolder='Email'
                    />
                    {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

                    <Input type="password" icon="padlock" name={'password'}
                        defaultValue={""}
                        placeHolder='Nueva contraseña (opcional)'
                        required={false}
                    />
                    {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}

                    <Input type="text" icon="person" name={'name'}
                        defaultValue={state.inputs?.name ?? seller?.name}
                        placeHolder='Nombre del dueño'
                        capitalize={true}
                    />
                    {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

                    <Input type="text" icon="paper" name={'last_name'}
                        defaultValue={state.inputs?.last_name ?? seller?.last_name}
                        placeHolder='Apellido'
                        capitalize={true}
                    />
                    {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}

                    <Input type="number" icon="id" name={'id_number'}
                        defaultValue={state.inputs?.id_number ?? seller?.id_number}
                        placeHolder='Número de cédula'
                    />
                    {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

                    <Input type="text" icon="address" name={'address'}
                        defaultValue={state.inputs?.address ?? seller?.address}
                        placeHolder='Dirección'
                        capitalize={true}
                    />
                    {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}

                    {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

                    {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                    <Button role="submit" type="secondary" disabled={isPending}>
                        {isPending && <OvalLoader/>}
                        {isPending ? 'Guardando...' : 'Editar Tienda'}
                    </Button>
                </Form>
            }
        </>
    )
}