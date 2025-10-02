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
    const [name, setName] = useState('')
    const [id_number, setId_number] = useState('')
    const [phone, setPhone] = useState('')

    const addCustomer = async () => {
        if (!name || !id_number || !phone) {
            return
        }

        try {
            const response = await axios.post(`${NEXT_PUBLIC_API_BASE_URL}/api/customers`, { name, id_number, phone }, { withCredentials: true })
        }catch (error) {
            console.log(error)
        }
    }
    return (
       <>
            <Form style={{width: '50%'}} onSubmit={(e) => {e.preventDefault(); addCustomer()}}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" onChange={(e) => setName(e.target.value)}/>
                <Input className={styles.inputNumber} type="number" placeHolder="Cedula" icon="id" onChange={(e) => setId_number(e.target.value)}/>
                <Input type="text" placeHolder="Telefono" icon="phone" onChange={(e) => setPhone(e.target.value)}/>
                <Button role="submit" type="secondary">
                    Agregar cliente
                </Button>
            </Form>
       </>
    )
}