import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'

export default function SelectCustomer({customer, setCustomer}) {
    return (
        <SelectedCustomer customer={customer} setCustomer={setCustomer}/>
    )
} 