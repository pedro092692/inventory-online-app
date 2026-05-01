import { useState } from 'react'
import CustomerSelector from '@/app/ui/customers/searchAndSelect/customerSelector'

export default function SelectedCustomer({customer}) {
    const [customerInfo, setCustomer] = useState(customer || null)


    return (
        <>
            <CustomerSelector value={customer} onChange={setCustomer} />
            <input name="customer_id" value={customerInfo?.id || ''} hidden readOnly />
        </>
    )
}