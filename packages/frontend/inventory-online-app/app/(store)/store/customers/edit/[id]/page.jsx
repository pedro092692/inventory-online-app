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

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function AddCustomer() {
    
    const [name, setName] = useState('')
    const [id_number, setId_number] = useState('')
    const [phone, setPhone] = useState('')
    const [errors, setErrors] = useState('')
    const [message, setMessage] = useState('')
    const [notFound, setNotFound] = useState('')
    const [loading, setLoading] = useState(true)
    const [limitInvoices, setLimitInvoices] = useState(0)
    const [offsetInvoices, setOffsetInvoices] = useState(0)
    const search = useSearchParams()?.get('search') || ''
    const page = useSearchParams()?.get('page') || 1
    const [id, setId] = useState(GetParam('id') || '')
    
    // get customer info
    const fetchCustomerInfo = async () => {
        try {  
            const customer = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}
                ?limitInvoices=${limitInvoices}?offsetInvoices=${offsetInvoices}`, 'GET')
            if (customer) {
                setId_number(customer.info.id_number)
                setName(customer.info.name)
                setPhone(customer.info.phone)
                
            }
        }catch (error){
            if (error.status === 404){
                setNotFound('Cliente no encontrado')
            }
        }finally {
            setLoading(false)
        }
    }

    
    useEffect(() => {
        fetchCustomerInfo()
    }, [])
   
    return (
       <>  
            <Route path='customers' endpoints={['default', 'view', 'edit']} customPage={true} page={page} search={search}/> 
            
            <Form className={`${styles.form} shadow`}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" onChange={(e) => setName(e.target.value)} value={loading ? 'Cargando...' : name} name={'name'}/>
                {errors?.name && <span className="field_error">{errors.name}</span>}
                <Input className={styles.inputNumber} type="number" placeHolder={loading ? 'Cargando...' : "Cedula"} icon="id" onChange={(e) => setId_number(e.target.value)} value={id_number} name={'id_number'}/>
                {errors?.id_number && <span className="field_error">{errors.id_number}</span>}
                <Input type="phone" icon="phone" onChange={(e) => setPhone(e.target.value)} value={phone} name={'phone'} formatPhone={setPhone}/>
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