'use client'
import axios from 'axios'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Button } from '@/app/ui/utils/button/buttons'
import { Input } from '@/app/ui/form/input/input'
import styles from './login.module.css'
import Link from 'next/link'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'
const dashboard = process.env.NEXT_PUBLIC_DASHBOARD


export default function SecurityPage() {
      const router = useRouter()
      const searchParams = useSearchParams()
      const nextUrl = searchParams.get('next') || dashboard

      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [error, setError] = useState('')

      const login = async () => {
        if(!email || !password) {
          return
        }
        try{
            const response = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/api/security/login`, {email, password}, {withCredentials: true})
            setTimeout(() => {
              router.push(nextUrl)
            }, 10)
        }catch(error) {
            if(error.response && error.response.status === 401) {
                  setError('Correo electrónico o contraseña no válidos.')
                  return 
                }
            
            console.error(error)
            setError('Hubo un error')
        }
        

      }

  return (
    <Container
      className={styles.section}
    >
      <Container
        className={`shadow ${styles.formContainer}`}
      >
        <Logo type='fullColorLogin'/>
        <h1 className='h2'>Inicia sesión en Nexastock</h1>
        <Container
          className={styles.form}
        >
          <Input type='email' placeHolder='Correo electrónico' onChange={(e) => setEmail(e.target.value)} style={{width: '100%'}}/>
          <Input type='password' placeHolder='Contraseña' onChange={(e) => setPassword(e.target.value)} style={{width: '100%'}}/>
          {error &&<p className='p3-r' style={{color: 'var(--color-accentRed400)'}}>{error} </p>}
          <Button onClick={login} role='submit' type='secondary' style={{width: '100%'}} className='p2-b'>Iniciar sesión</Button>
          <Link
            href='/'
            style={{width: '100%'}}
          >
            <Button type='warning' className='p2-r' style={{width: '100%'}}>Volver al inicio</Button>
          </Link>
        </Container>
        
      </Container>
      
    </Container>
  )
}

