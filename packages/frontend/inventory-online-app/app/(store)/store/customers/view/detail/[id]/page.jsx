'use client'
import fetchData from '@/app/utils/fetchData'
import GetParam from '@/app/utils/getParam'
import { useEffect, useState } from 'react'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import Route from '@/app/ui/routesLinks/routes'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function CustomerDetail() {
    const [customer, setCustomer] = useState(null)
    const [id, setId] = useState(GetParam('id'))
    const data = async () => {
        const constumer = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}`, 'GET')
        setCustomer(constumer)
    }
    useEffect(() => {
        data()
    }, [])

    
    return (
        <>
        <Route path='customers' endpoints={['default', 'view', 'detail']} /> 
        <Form className={'shadow'}>
            <Input type="text" icon="person" value={`${customer?.name}`} name={'name'} readOnly={true}/>
            <Input type="text" icon="id" value={`${customer?.id_number}`} name={'id_number'} readOnly={true}/>
            <Input type="text" icon="phone" value={`${customer?.phone}`} name={'cellphone'} readOnly={true}/>        
        </Form>
        </>
    )
}