import { Container } from "@/app/ui/utils/container"

export default function InvoiceBasicInfo({invoice}) {
    return (
        <Container
        padding={'0px'}
        direction={'row'}
        width={'100%'}
        justifyContent={'space-between'}
        alignItem={'start'}
        >
        
        {/* order basic details id and seller */}
        <Container
            padding={'0px'}
            direction={'column'}
            gap={'8px'}
            alignItem={'start'}
        >
            {/* order id */}
            <h3 className='p2-b'>N° Recibo: 
                <span className='p2-r'>
                    {` ${String(invoice?.id).padStart(8, '0')|| ''}`}
                </span>
            </h3>
            {/* seller */}
            <h3 className='p2-b'>Vendedor: 
                <span className='p2-r'>
                    { ` ${invoice?.seller.name}` || ' Default Seller'}
                </span>
            </h3>
        </Container>
        
        {/* date: */}
        <Container padding={'0px'}>
            <h3 className='p2-b'>Fecha: 
                <span className='p2-r'>
                    {` ${invoice?.date ? formaDate(invoice?.date) : ''}`}
                </span>
            </h3>
            {/* time */}
            <h3 className='p2-b'>Hora: 
                <span className='p2-r'>
                    {` ${invoice?.date ? formaDate(invoice?.date, true) : ''}`}
                </span>
            </h3>
        </Container>
    </Container>
    )
}

function formaDate(date, time = false) {
    if(!time) {
        return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
    }

    const actualDate = new Date(date)
    let hours = actualDate.getUTCHours()
    let minutes = actualDate.getUTCMinutes()
    const ampm = hours >=12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const min = minutes.toString().padStart(2, '0')
    return `${hours}:${min} ${ampm}`
}