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
    const [searchBillNumber, setSearchBillNumber] = useState('')
    const [tableData, setTableData] = useState([])
    const page = GetQueryParam('page') || 1
    const search = GetQueryParam('search') || ''
    

    const customerInfo = async (invoiceLimit, offsetInvoices) => {
        const url = `${NEXT_PUBLIC_API_BASE_URL}/api/customers/${id}`
        const params = new URLSearchParams()
        params.append('limitInvoices', invoiceLimit)
        params.append('offsetInvoices', offsetInvoices)
        return await errorHandler( async () => {
            const data = await fetchData(`${url}?${params.toString()}`, 'GET')
            if (data) {
                setCustomer(data.customer)
                setTotalInvoices(data.totalInvoices)
                setInvoicePage(data.pageInvoices)
                setTableData(transformData(data.customer.invoices))
            }
        }, setLoading)

        
    }

    const searchInvoicesByBillNumber = async (billNumber, limit, offset) => {
        if (!billNumber || isNaN(billNumber)) {
            customerInfo(invoiceLimit, offsetInvoices)
            setSearchBillNumber(null)
            return
        }

        try {
            const response = await fetchData(
                `${NEXT_PUBLIC_API_BASE_URL}/api/invoices/search/?query=${billNumber}&customer_id=${id}&limit=${limit}&offset=${offset}`, 
                'GET')
            if (response) {
                setTableData(transformData({invoices: response.invoices}))
                setTotalInvoices(response.total)
                setInvoicePage(response.page)
                setSearchBillNumber(billNumber)
            }

        }catch (error) {
            console.log('hola')
            if (error.response) {
                console.log(error.response.status)
                console.log(error.response.data.message)
            }
        }
        
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
                    data: new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }), 
                    id: invoice.id
                }
            ))   
        }
        return data
    }

    const totalPages = Math.ceil(totalInvoices / invoiceLimit)
    const currentPage = invoicePage
    const maxVisiblePages = 8

     
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
                            value={searchBillNumber}
                            searchFn={searchInvoicesByBillNumber}
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
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            maxVisiblePages={maxVisiblePages}
                            setOffset={setOffsetInvoices}
                            limit={invoiceLimit}
                            param={'invoice_page'}
                            fetchData={searchBillNumber ? searchInvoicesByBillNumber : customerInfo}
                            searchTerm={searchBillNumber}
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

