'use client'
import { Button } from '@/app/ui/utils/button/buttons'
import { Input } from '@/app/ui/form/input/input'
import { Form } from '@/app/ui/form/form/form'
import Link from 'next/link'

export default function LoginForm({}) {
    return (
        <Form >
            <Input icon='mail' type='email' placeHolder='Correo electrónico'  style={{width: '100%'}} />
            <Input icon='key' type='password' placeHolder='Contraseña'  style={{width: '100%'}} />
            
            <Button role='submit' type='secondary' style={{width: '100%'}} className='p2-b'>Iniciar sesión</Button>
            <Link
                href='/'
                style={{width: '100%'}}
            >
                <Button type='warning' className='p2-r' style={{width: '100%'}}>Volver al inicio</Button>
            </Link>
        </Form>
    )
}