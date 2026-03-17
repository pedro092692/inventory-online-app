'use client'
import fetchData from '@/app/utils/fetchData'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import GetParam from '@/app/utils/getParam'
import { useEffect, useState } from 'react'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import Route from '@/app/ui/routesLinks/routes'
import styles from './input.module.css'
import Search from '@/app/ui/form/search/search'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import { updatePagination } from '@/app/utils/updatePagination'
import GetQueryParam from '@/app/utils/getQueryParam'
import { Container } from '@/app/ui/utils/container'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function CustomerDetail() {
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(GetParam('id'))
    const [invoiceLimit, setInvoiceLimit] = useState(8)
    const [offsetInvoices, setOffsetInvoices] = useState(GetQueryParam('invoice_page', 'pagination') * invoiceLimit)
    const [invoicePage, setInvoicePage] = useState(1)
    const [totalInvoices, setTotalInvoices] = useState(0)
    const [maxVisiblePages, setMaxVisiblePages] = useState(8)
    const [query, setQuery] = useState('')
    const [tableData, setTableData] = useState([])
    const page = GetQueryParam('page') || 1
    const search = GetQueryParam('search') || ''
    

    const customerInfo = async (invoiceLimit, offsetInvoices) => {
        const endpoint = `/api/customers/${id}`
        const params = new URLSearchParams()
        params.append('limitInvoices', invoiceLimit)
        params.append('offsetInvoices', offsetInvoices)
        const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}?${params.toString()}`
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                setCustomer(data.customer)
                setTableData(transformData(data.customer.invoices))
                updatePagination(setTotalInvoices, setInvoicePage, data.totalInvoices, invoiceLimit, data.pageInvoices)
            }
        }, setLoading)
    }

    const searchInvoices = async (limit, offset, query = null) => {
        if (!query || isNaN(query)) {
            setQuery(null)
            customerInfo(invoiceLimit, offsetInvoices)
            return
        }
        const params = new URLSearchParams()
        const endpoint = `${NEXT_PUBLIC_API_BASE_URL}/api/invoices/search/`
        params.append('query', query)
        params.append('customer_id', id)
        params.append('limit', limit)
        params.append('offset', offset)
        const url = `${endpoint}?${params.toString()}`
        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                setTableData(transformData(data.invoices))
                setQuery(query)
                updatePagination(setTotalInvoices, setInvoicePage, data.total, invoiceLimit, data.page)
            }
        }, setLoading)      
    }

    useEffect(() => {
        setLoading(true)
        customerInfo(invoiceLimit, offsetInvoices)
    }, [])

    const transformData = (invoices) => {
        let data = []
        if (invoices.length > 0) {
            data = invoices.map(invoice => (
                {
                    bill_id: invoice.id,
                    total: `$ ${invoice.total}`,
                    status: invoice.status == 'paid' ? 'Pagado' : 'Pendiente',
                    date: new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }), 
                    id: invoice.id
                }
            ))   
        }
        return data
    }

    return (
        <>
        <Route path='customers' endpoints={['default', 'view', 'detail']} customPage={true} page={page} search={search}/> 
        {
            loading ? <p>Cargando...</p>
            :
            customer == null ? <p>Cliente no encontrado</p>
            :
            <>
                <Form className={`${styles.formview} shadow`}>
                    <Input type="text" icon="person" value={`${customer?.name}`} name={'name'} readOnly={true}/>
                    <Input type="text" icon="id" value={`${customer?.id_number}`} name={'id_number'} readOnly={true}/>
                    <Input type="text" icon="phone" value={`${customer?.phone}`} name={'cellphone'} readOnly={true}/>        
                </Form>

                {   
                    customer.invoices.length > 0 ?
                    <Container listContiner={true}>
                        <p style={{marginTop: '15px'}} className='p1-r'>Facturas De: {`${customer?.name}`}</p>
                        <Search 
                            placeHolder={'Buscar N° de Recibo...'}
                            inputMode={'numeric'}
                            value={query}
                            searchFn={searchInvoices}
                            limit={invoiceLimit}
                            offset={offsetInvoices}
                            setOffset={setOffsetInvoices}
                            setURLParam={false}
                        />
                        <List tableHead={
                            {
                            'bill_id': 'N° Recibo',
                            'total': 'Total',
                            'status': 'Estado',
                            'date': 'Fecha',
                            'actions': 'Acciones',
                            }
                        } 
                            tableData={tableData}  
                            actions={[]}
                            showActions={false}
                            CustomStyles={{height: '317px'}}
                            customClass={styles.table}
                        />
                        <Pagination
                            currentPage={invoicePage}
                            totalPages={totalInvoices}
                            maxVisiblePages={maxVisiblePages}
                            setOffset={setOffsetInvoices}
                            limit={invoiceLimit}
                            param={'invoice_page'}
                            fetchDataFn={query ? searchInvoices : customerInfo}
                            searchTerm={query}
                        />

                    </Container>
                    :
                    <p style={{marginTop: '15px'}}>El cliente no tiene facturas</p>
                }
            </>
        }
        </>
    )
}

