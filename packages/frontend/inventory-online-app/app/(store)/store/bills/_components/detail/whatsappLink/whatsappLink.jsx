import GetItemAction from '@/app/lib/actions/get'
import GenerateLinkButton from './generateButton'
import { Button } from '@/app/ui/utils/button/buttons'

export default async function GenerateWhatsLink({invoice_id}) {
    const url = `invoices/send-whatsapp/${invoice_id}`
    const response = await GetItemAction(url)
    const {data, error} = response
    const link = data?.link
    // FetchData resolves 4xx errors (other than 404) as `{errors: message}` instead of throwing,
    // so a failure here shows up as `data.errors`, not `error`.
    const failureReason = error || data?.errors

    return (
        <>
            {
                link
                ? <GenerateLinkButton link={link} />
                : <Button type="disabled" children='' disabled={true} showIcon={true} icon="whatsapp" size={[24, 24]}
                    style={{padding: '8px'}}
                    title={failureReason || 'No se pudo generar el enlace de WhatsApp'}
                  />
            }
        </>
    )
}