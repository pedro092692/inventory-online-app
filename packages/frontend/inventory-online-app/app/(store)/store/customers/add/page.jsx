'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import Route from '@/app/ui/routesLinks/routes'
import styles from './input.module.css'
import { useState } from 'react'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import fetchData from '@/app/utils/fetchData'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function AddCustomer() {

    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState(null)
    const [name, setName] = useState('')
    const [id_number, setId_number] = useState('')
    const [phone, setPhone] = useState('')

    const addCustomer = async () => {
        if( !name, !id_number, !phone) return

        const url = `${NEXT_PUBLIC_API_BASE_URL}/api/customers` 

        return await errorHandler( async () => {
            setErrors(null)
            const data = await fetchData(url, 'POST', {name, id_number, phone})
            if (data) {
                setMessage('Cliente agregado con éxito')
                setName('')
                setId_number('')
                setPhone('')
                setTimeout(() => {
                    setMessage(null)
                }, 2000)
            }
        }, null, setErrors, 'Hubo un error al agregar el cliente')

    }


    return (
       <>   
            <Route path='customers' endpoints={['default', 'add']} /> 
            <Form className={`${styles.form} shadow`}  onSubmit={(e) => {e.preventDefault(); addCustomer()}}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" onChange={(e) => setName(e.target.value)} value={name} name={'name'} capitalize={true}/>
                {errors?.name && <span className="field_error">{errors.name}</span>}
                <Input className={styles.inputNumber} type="number" placeHolder="Cedula" icon="id" onChange={(e) => setId_number(e.target.value)} value={id_number} name={'id_number'}/>
                {errors?.id_number && <span className="field_error">{errors.id_number}</span>}
                <Input type="phone" icon="phone" onChange={(e) => setPhone(e.target.value)} value={phone} name={'phone'} formatPhone={setPhone}/>
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