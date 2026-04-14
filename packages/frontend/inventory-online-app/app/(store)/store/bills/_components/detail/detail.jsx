import GetItemAction from '@/app/lib/actions/get'
import BillDetailForm from '@/app/(store)/store/bills/_components/detail/formDetail'

export default async function BillInfo({ id }) {
    const endpoint = `invoices/${id}`
    const response = await GetItemAction(endpoint)
    const { data, error } = response
    await new Promise(resolve => setTimeout(resolve, 1000))
    const invoice = data?.invoice || null
    return (
        <>
            <BillDetailForm bill={invoice} readOnly={true}/>
        </>
    )

    }