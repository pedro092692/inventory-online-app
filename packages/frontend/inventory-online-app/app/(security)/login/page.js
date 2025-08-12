'use client'
import axios from 'axios'
import { useState } from 'react'

export default function Home() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const login = async () => {
        try{
            const response = await axios.post('http://127.0.0.1:4000/api/security/login', {email, password}, {withCredentials: true})
            console.log(response.data)
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
      </div>
    </>
  )
}

