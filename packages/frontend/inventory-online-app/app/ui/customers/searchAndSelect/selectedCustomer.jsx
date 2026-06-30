import { useState } from 'react'
import CustomerSelector from '@/app/ui/customers/searchAndSelect/customerSelector'

export default function SelectedCustomer({ customer, setCustomer, showResult=true, bgColor}) {
    return (
        <>
            <CustomerSelector value={customer} onChange={setCustomer} showResult={showResult} bgColor={bgColor}/>
            <input name="customer_id" value={customer?.id || ''} hidden readOnly />
        </>
    )
}