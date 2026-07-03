import { useState } from 'react'
import CustomerSelector from '@/app/ui/customers/searchAndSelect/customerSelector'

export default function SelectedCustomer({ customer, setCustomer, showResult=true, bgColor, activeScreen=null}) {
    return (
        <>
            <CustomerSelector value={customer} onChange={setCustomer} showResult={showResult} bgColor={bgColor} activeScreen={activeScreen}/>
            <input name="customer_id" value={customer?.id || ''} hidden readOnly/>
        </>
    )
}