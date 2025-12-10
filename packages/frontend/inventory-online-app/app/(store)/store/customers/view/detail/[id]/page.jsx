'use client'
import fetchData from '@/app/utils/fetchData'
import GetParam from '@/app/utils/getParam'
import { useEffect, useState } from 'react'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import Route from '@/app/ui/routesLinks/routes'
import { useSearchParams } from 'next/navigation'
import styles from './input.module.css'
import List from '@/app/ui/list/list'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function CustomerDetail() {
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(GetParam('id'))
    const [tableData, setTableData] = useState([])
    const page = useSearchParams()?.get('page') || 1

    const data = async () => {
        try {
            const constumer = await fetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}`, 'GET')
            if (constumer) {
                setCustomer(constumer)
                setTableData(transformData(constumer))
            }
        }catch (error) {
            if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data.message)
            }
        }finally {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        setLoading(true)
        data()
    }, [])

    const transformData = (customer) => {
        let data = []
        if (customer.invoices.length > 0) {
            data = customer.invoices.map(invoice => (
                {
                    bill_id: invoice.id,
                    total: `$ ${invoice.total}`,
                    status: invoice.status == 'paid' ? 'Pagado' : 'Pendiente',
                    id: invoice.id
                }
            ))
        }
        return data
    }

     
    return (
        <>
        <Route path='customers' endpoints={['default', 'view', 'detail']} customPage={true} page={page}/> 
        {
            loading ? <p>Cargando...</p>
            :
            <>
                <Form className={`${styles.form} shadow`}>
                    <Input type="text" icon="person" value={`${customer?.name}`} name={'name'} readOnly={true}/>
                    <Input type="text" icon="id" value={`${customer?.id_number}`} name={'id_number'} readOnly={true}/>
                    <Input type="text" icon="phone" value={`${customer?.phone}`} name={'cellphone'} readOnly={true}/>        
                </Form>

                {
                    customer.invoices.length > 0 ?
                    <List tableHead={
                        {
                        'bill_id': 'N° Recibo',
                        'total': 'Total',
                        'status': 'Estado',
                        'actions': 'Acciones'
                        }
                    } 
                        tableData={tableData}  
                        actions={[]}
                        showActions={false}
                        CustomStyles={{marginTop: '15px'}}
                    />
                    :
                    <p>El cliente no tiene facturas</p>
                }
            </>
        }
        
        </>
    )
}