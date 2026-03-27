'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { Input } from '@/app/ui/form/input/input'
import { Form } from '@/app/ui/form/form/form'
import Link from 'next/link'
import Login from '@/app/lib/login/login'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState } from 'react'

export default function LoginForm() {

    const initialState = {message: null, inputs: {}, error: null}
    const [state, formAction, isPending] = useActionState(Login, initialState)

    return (
        <Form action={formAction} >
            <Input icon='mail' type='email' placeHolder='Correo electrónico' defaultValue={state.inputs?.email ?? ""} name={'email'} style={{width: '100%'}} />
            <Input icon='key' type='password' placeHolder='Contraseña' defaultValue={state.inputs?.password ?? ""} name={'password'}  style={{width: '100%'}} />
            
            {state?.error && <p className='p3-r' style={{color: 'var(--color-accentRed400)'}}>{state.error} </p> }
            
            <Button role='submit' type='secondary' style={{width: '100%'}} className='p2-b'>
                {isPending && <OvalLoader/>}   
                {isPending ? 'Iniciando sesión' : 'Iniciar sesión'} 
            </Button>
            <Link
                href='/'
                style={{width: '100%'}}
            >
                <Button type='warning' className='p2-r' style={{width: '100%'}}>Volver al inicio</Button>
            </Link>
        </Form>
    )
}