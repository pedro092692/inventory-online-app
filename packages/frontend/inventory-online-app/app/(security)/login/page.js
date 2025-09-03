'use client'
import axios from 'axios'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default function SecurityPage() {
      const router = useRouter()
      const searchParams = useSearchParams()
      const nextUrl = searchParams.get('next') || '/'


      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const login = async () => {
        try{
            const response = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/api/security/login`, {email, password}, {withCredentials: true})
            setTimeout(() => {
              router.push(nextUrl)
            }, 10)

        }catch(error) {
            if(error.response) {
                console.log(error.response.status)
                console.log(error.response.data.message)
            }
            console.error(error.message)
        }
        

      }

  return (
    <Container
      direction='column'
      backgroundColor='blue'
      flexGrow='1'
      padding='24px'
    >
      <Container
        direction='column'
        backgroundColor='coral'
        gap='16px'
      >
        <Logo />
        <h1 className='p1-b'>Inicia sesión en Nexastock</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {/* <button onClick={login}>Login</button> */}
        <Button type='secondary'>Iniciar sesión</Button>
        <Link href={'/'}>Inicio</Link>
      </Container>
      
    </Container>
  )
}

