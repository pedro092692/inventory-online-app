'use client'
import { Title } from "@/app/ui/dashboard/title/title"
import { Form } from "@/app/ui/form/form/form"
import { Input } from "@/app/ui/form/input/input"
import { Button } from "@/app/ui/utils/button/buttons"
import styles from "./input.module.css"
import { useState } from "react"
import axios from "axios"
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function AddCustomer() {

    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState(null)
    const [name, setName] = useState('pedro')
    const [id_number, setId_number] = useState('')
    const [phone, setPhone] = useState('')

    const addCustomer = async () => {
        if (!name || !id_number || !phone) {
            return
        }

        try {
            const response = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/api/customers`, { name, id_number, phone }, { withCredentials: true })
            setMessage('Cliente agregado con exito')
            setErrors(null)
            setName('')
            setPhone('')
            setId_number('')
            // reset errors form
        }catch (error) {
            if (error.status == 400 &&  error.response.data.errors) {
                setErrors(error.response.data.errors) 
            }else {
                setErrors('Hubo un error al agregar el cliente')
            }
        }
    }

    return (
       <>
            <Form style={{width: '50%'}} onSubmit={(e) => {e.preventDefault(); addCustomer()}}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" onChange={(e) => setName(e.target.value)} value={name} name={'name'}/>
                {errors?.name && <span className="field_error">{errors.name}</span>}
                <Input className={styles.inputNumber} type="number" placeHolder="Cedula" icon="id" onChange={(e) => setId_number(e.target.value)} value={id_number} name={'id_number'}/>
                {errors?.id_number && <span className="field_error">{errors.id_number}</span>}
                <Input type="text" placeHolder="Telefono" icon="phone" onChange={(e) => setPhone(e.target.value)} value={phone} name={'phone'}/>
                {errors?.phone && <span className="field_error">{errors.phone}</span>}
                <Button role="submit" type="secondary">
                    Agregar cliente
                </Button>
                {typeof errors === 'string' && <span className="field_error">{errors}</span>}
                {message && <span style={{color: 'green', marginTop: '8px'}}>{message}</span>}
            </Form>
       </>
    )
}