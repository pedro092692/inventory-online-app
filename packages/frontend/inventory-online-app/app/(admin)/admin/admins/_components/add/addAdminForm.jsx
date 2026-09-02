'use client'
import AddItemAction from '@/app/lib/actions/add'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState } from 'react'

export default function AddAdminForm() {
    const initialState = {message: null, inputs: {}, errors: {}}
    const addAdmin = AddItemAction.bind(null, 'users/admins', ['email', 'password'], 'Administrador creado con éxito')
    const [state, formAction, isPending] = useActionState(addAdmin, initialState)

    return (
        <Container
            direction={'column'}
            padding={'16px'}
            gap={'8px'}
            borderRadius={'8px'}
            className='shadow-sm'
            backgroundColor="var(--color-neutralGrey200)"
        >
            <p className='p2-r'>
                El nuevo administrador tendrá acceso completo al panel de administración, pero no podrá agregar otros administradores.
            </p>
            <Form action={formAction}>
                <Input type="email" icon="mail" name={'email'}
                    defaultValue={state.inputs?.email ?? ""}
                    placeHolder='Email'
                />
                {state?.errors?.email && <span className="field_error">{state?.errors?.email}</span>}

                <Input type="password" icon="padlock" name={'password'}
                    defaultValue={state.inputs?.password ?? ""}
                    autocomplete={'new-password'}
                    placeHolder='Contraseña'
                />
                {state?.errors?.password && <span className="field_error">{state?.errors?.password}</span>}

                {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}
                {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                <Button role="submit" type="secondary" disabled={isPending}>
                    {isPending && <OvalLoader/>}
                    {isPending ? 'Creando...' : 'Crear administrador'}
                </Button>
            </Form>
        </Container>
    )
}
