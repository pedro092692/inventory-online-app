'use client'
import { Form } from '@/app/ui/form/form/form'
import { Button } from '@/app/ui/utils/button/buttons'
import EditItemAction from '@/app/lib/actions/edit'
import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'


export default function InvoiceDetailForm({invoice=null, sellers=null}) {
    // console.log(invoice)
    const originalValues = {
        seller_id: invoice?.seller_id
    }

    //add id to customer object 
    invoice.customer['id'] = invoice['customer_id']
    
    const [sellerId, setSellerId] = useState(invoice?.seller_id || '')

    const initialSte = {message: null, inputs: originalValues, errors: {}}
    const updateInvoice = EditItemAction.bind(null, `invoices/${invoice?.id}`, 
        ['seller_id', 'customer_id'], 'Factura editada con éxito')
    
    const [state, formAction, isPending] = useActionState(updateInvoice, initialSte)

 

    useEffect(() => {
        const success = state?.message 
        setSellerId(invoice?.seller_id || '')
    }, [state, invoice?.seller_id, invoice?.customer_id]) 

    return (
        <Form className={'form-edit'} style={{padding: "16px"}} action={formAction}>
            <label>Vendedor</label>
            <select name="seller_id" value={sellerId} onChange={(e) => setSellerId(e.target.value)}>
                {sellers.map(seller => (
                    <option key={seller.id} value={seller.id}>
                        {seller.name}
                    </option>
                ))}
            </select>
            
            <SelectedCustomer customer={invoice.customer}/>

            {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}
            <Button role="submit" type="secondary">
                {isPending && <OvalLoader/>}   
                {isPending ? 'Guardando...' : 'Editar Orden de compra'}
            </Button>
        </Form>
    )
}