import GetItemAction from '@/app/lib/actions/get'
import GenerateLinkButton from './generateButton'

export default async function GenerateWhatsLink({invoice_id}) {
    const url = `invoices/send-whatsapp/${invoice_id}`
    const response = await GetItemAction(url)
    const {data, error} = response
    const link = data?.link
    
    return (
        <>
            {
                !error 
                ? <GenerateLinkButton link={link} />
                : '❌'
            }
        </>
    )
}