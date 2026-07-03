import SelectedCustomer from '@/app/ui/customers/searchAndSelect/selectedCustomer'

export default function SelectCustomer({customer, setCustomer, showResult=true, bgColor, activeScreen=null}) {
    return (
        <SelectedCustomer customer={customer} setCustomer={setCustomer} showResult={showResult} bgColor={bgColor} activeScreen={activeScreen}/>
    )
} 