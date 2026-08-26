'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState } from 'react'

const fieldsetStyle = {
    border: '1px solid var(--color-neutralGrey600)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
}
const legendStyle = { padding: '0 8px' }

export default function StoreOwnerDetailForm({user, seller, store}) {
    const originalValues = {
        email: user?.email,
        store_name: store?.name,
        fiscal_id: store?.fiscal_id,
        store_phone: store?.phone,
        name: seller?.name,
        last_name: seller?.last_name,
        id_number: seller?.id_number,
        address: seller?.address,
    }
    const initialState = {message: null, inputs: originalValues, errors: {}}

    const updateStoreOwner = EditItemAction.bind(null, `users/storeOwner/${user?.id}`,
        ['email', 'password', 'store_name', 'fiscal_id', 'store_phone', 'name', 'last_name', 'id_number', 'address'],
        'Tienda editada con éxito')

    const [state, formAction, isPending] = useActionState(updateStoreOwner, initialState)
    const [phoneValue, setPhoneValue] = useState(state.inputs?.store_phone ?? store?.phone ?? '')

    const handleSubmit = (formData) => {
        const formattedPhone = formData.get('store_phone') || ''
        formData.set('store_phone', '+' + formattedPhone.replace(/\D/g, ''))
        return formAction(formData)
    }

    return (
        <>
            {user &&
                <Form className={`${styles.formview} shadow`} action={handleSubmit}>

                    <fieldset style={fieldsetStyle}>
                        <legend className='p2-b' style={legendStyle}>Datos de la tienda</legend>

                        <Input type="text" icon="store" name={'store_name'}
                            defaultValue={state.inputs?.store_name ?? store?.name}
                            placeHolder='Nombre de la tienda' capitalize={true}
                        />
                        {state?.errors?.store_name && <span className="field_error">{state?.errors?.store_name}</span>}

                        <Input type="text" icon="id" name={'fiscal_id'}
                            defaultValue={state.inputs?.fiscal_id ?? store?.fiscal_id}
                            placeHolder='Registro fiscal (opcional)' required={false}
                        />
                        {state?.errors?.fiscal_id && <span className="field_error">{state?.errors?.fiscal_id}</span>}

                        <Input type="phone" icon="phone" value={phoneValue} name={'store_phone'}
                            onChange={(e) => setPhoneValue(e.target.value)}
                        />
                        {state?.errors?.store_phone && <span className="field_error">{state?.errors?.store_phone}</span>}
                    </fieldset>

                    <fieldset style={fieldsetStyle}>
                        <legend className='p2-b' style={legendStyle}>Datos del usuario</legend>

                        <Input type="email" icon="mail" name={'email'}
                            defaultValue={state.inputs?.email ?? user?.email}
                            placeHolder='Email'
                        />
                        {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

                        <Input type="password" icon="padlock" name={'password'}
                            defaultValue={""}
                            placeHolder='Nueva contraseña (opcional)' required={false}
                        />
                        {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}
                    </fieldset>

                    <fieldset style={fieldsetStyle}>
                        <legend className='p2-b' style={legendStyle}>Datos del vendedor</legend>

                        <Input type="text" icon="person" name={'name'}
                            defaultValue={state.inputs?.name ?? seller?.name}
                            placeHolder='Nombre del dueño' capitalize={true}
                        />
                        {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}

                        <Input type="text" icon="paper" name={'last_name'}
                            defaultValue={state.inputs?.last_name ?? seller?.last_name}
                            placeHolder='Apellido' capitalize={true}
                        />
                        {state?.errors?.last_name && <span className="field_error">{state?.errors?.last_name}</span>}

                        <Input type="number" icon="id" name={'id_number'}
                            defaultValue={state.inputs?.id_number ?? seller?.id_number}
                            placeHolder='Número de cédula'
                        />
                        {state?.errors?.id_number && <span className="field_error">{state?.errors?.id_number}</span>}

                        <Input type="text" icon="address" name={'address'}
                            defaultValue={state.inputs?.address ?? seller?.address}
                            placeHolder='Dirección' capitalize={true}
                        />
                        {state?.errors?.address && <span className="field_error">{state?.errors?.address}</span>}
                    </fieldset>

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