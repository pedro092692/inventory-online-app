import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'

export default function SelectCustomer({customer, setCustomer, showResult=true, bgColor}) {
    return (
        <SelectedCustomer customer={customer} setCustomer={setCustomer} showResult={showResult} bgColor={bgColor}/>
    )
} 