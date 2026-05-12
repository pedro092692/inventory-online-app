'use client'
import { Form } from '@/app/ui/form/form/form'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import EditItemAction from '@/app/lib/actions/edit'
import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'
import SelectObject from '@/app/utils/selectObject'
import Select from '@/app/ui/select/select'
import styles from './invoice.module.css'


export default function InvoiceDetailForm({invoice=null, sellers=null}) {
    const originalValues = {
        seller_id: invoice?.seller_id
    }

    //add id to customer object 
    invoice.customer['id'] = invoice['customer_id']
    const date = new Date(invoice?.date).toISOString()
    
    const [sellerId, setSellerId] = useState(invoice?.seller_id || '')
    const sellerOptions = SelectObject(sellers, 'id', 'name') || []
    

    const initialSte = {message: null, inputs: originalValues, errors: {}}
    const updateInvoice = EditItemAction.bind(null, `invoices/${invoice?.id}`, 
        ['seller_id', 'customer_id'], 'Factura editada con éxito')
    
    const [state, formAction, isPending] = useActionState(updateInvoice, initialSte)


    useEffect(() => {
        const success = state?.message 
        setSellerId(invoice?.seller_id || '')
    }, [state, invoice?.seller_id, invoice?.customer_id]) 

    return (
        <Form className={styles.form} style={{padding: '16px', flexGrow: '0'}} action={formAction}>
            <Container
                width={'100%'}
                padding={'8px'}
                direction={'column'}
                alignItem={'start'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
            >   
                <h2 className='h3'>Editar factura #{invoice?.id}</h2>
                <Container
                    padding={'0px'}
                    width={'100%'}
                    justifyContent={'space-between'}
                >
                    <p>Fecha:</p>
                    <p className='p2'>{new Date(invoice?.date).toLocaleDateString('es-VE', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </Container>
                <p>Hora: {new Intl.DateTimeFormat('es-VE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                }).format(new Date(date))}</p>
            </Container>
            
            <label>Vendedor</label>
            <Select name='seller_id' options={sellerOptions} selectKey={sellerId} defaultValue={invoice?.seller?.name || 'No tiene vendedor'}/>
            
           
            <label>Cliente</label>
            <SelectedCustomer customer={invoice.customer}/>

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            <Button role="submit" type="secondary">
                {isPending && <OvalLoader/>}   
                {isPending ? 'Guardando...' : 'Editar Orden de compra'}
            </Button>
        </Form>
    )
}