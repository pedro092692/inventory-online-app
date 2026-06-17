import { useState } from 'react'
import CustomerSelector from '@/app/ui/customers/searchAndSelect/customerSelector'

export default function SelectedCustomer({ customer, setCustomer }) {
    return (
        <>
            <CustomerSelector value={customer} onChange={setCustomer} />
            <input name="customer_id" value={customer?.id || ''} hidden readOnly />
        </>
    )
}