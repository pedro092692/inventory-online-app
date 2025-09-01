'use client'
import axios from 'axios'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
    <>
      <h1>Bienvenido usuario ahora puede iniciar sesion</h1>
      <div>
        <div>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
        <Link href={'/'}>Inicio</Link>
      </div>
    </>
  )
}

