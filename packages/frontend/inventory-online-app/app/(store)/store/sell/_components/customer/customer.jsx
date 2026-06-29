import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'

export default function SelectCustomer({customer, setCustomer, showResult=true}) {
    return (
        <SelectedCustomer customer={customer} setCustomer={setCustomer} showResult={showResult}/>
    )
} 