'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import Route from '@/app/ui/routesLinks/routes'
import styles from './input.module.css'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import GetParam from '@/app/utils/getParam'
import fetchData from '@/app/utils/fetchData'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function AddCustomer() {
    
    const [name, setName] = useState('')
    const [id_number, setId_number] = useState('')
    const [phone, setPhone] = useState('')
    const [errors, setErrors] = useState('')
    const [message, setMessage] = useState('')
    const [notFound, setNotFound] = useState('')
    const [loading, setLoading] = useState(true)
    const [field, setField] = useState({name: {isEdited: false,}, id_number: {isEdited: false}, phone: {isEdited: false}})
    const search = useSearchParams()?.get('search') || ''
    const page = useSearchParams()?.get('page') || 1
    const [id, setId] = useState(GetParam('id') || '')
    
    // get customer info
    const customerInfo = async () => {
        const endpoint = `/api/customers/${id}`
        const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data){
                setName(data.customer.name)
                setId_number(data.customer.id_number)
                setPhone(data.customer.phone)
            } 
        }, setLoading, setNotFound, 'Cliente no encontrado')
    }

    // edit customer info
    const editCustomer = async () => {
        if (!field.name.isEdited && !field.id_number.isEdited && !field.phone.isEdited) {
            return
        }
       
        
        const endpoint = `/api/customers/${id}`
        const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
        
        return await errorHandler( async () => {
            const response = await  fetchData(url, 'PATCH', 
                {
                    name,
                    id_number,
                    phone
                }
            )
            if (response) {
                setMessage('Cliente Editado con éxito')
                setErrors(null)
                setField({name: {isEdited: false}, id_number: {isEdited: false}, phone: {isEdited: false}})
            }
        }, null, setErrors, 'Error al editar el cliente')
    }
    

    useEffect(() => {
        customerInfo()
    }, [])
    
    return (
       <>  
            <Route path='customers' endpoints={['default', 'view', 'edit']} customPage={true} page={page} search={search}/> 
            <Form className={`${styles.form} shadow`} onSubmit={(e) => {e.preventDefault(); editCustomer()}}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" onChange={(e) => {setName(e.target.value); setField({...field, name:{isEdited: true} })}} value={loading ? 'Cargando...' : name} name={'name'} capitalize={true}/>
                {errors?.name && <span className="field_error">{errors.name}</span>}
                <Input className={styles.inputNumber} type="number" placeHolder={loading ? 'Cargando...' : "Cedula"} icon="id" onChange={(e) => {setId_number(e.target.value); setField({...field, id_number:{isEdited: true}})}} value={id_number} name={'id_number'}/>
                {errors?.id_number && <span className="field_error">{errors.id_number}</span>}
                <Input type="phone" icon="phone" onChange={(e) => setPhone(e.target.value)} value={phone} name={'phone'} setField={setField} formatPhone={setPhone}/>
                {errors?.phone && <span className="field_error">{errors.phone}</span>}
                <Button role="submit" type="secondary">
                    Editar cliente
                </Button>
                {typeof errors === 'string' && <span className="field_error">{errors}</span>}
                {message && <span style={{color: 'green', marginTop: '8px'}}>{message}</span>}
                {notFound && <span style={{color: 'red'}}>{notFound}</span>}
            </Form>
       </>
    )
}