'use client'
import { useRef } from 'react'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'

export default function InvoicePDF({info=null, customer=null, billStatus=null, products=null, payments=null, id=null}) {
    const componentRef = useRef(null)

    const handleInvoicePDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default

        const element = componentRef.current

        const options = {
            margin: 10,
            filename: `factura_${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(options).from(element).save()
    }

    return (
        <>
            <Button type='grey' style={{backgroundColor: 'var(--color-accentRed400)'}}
                onClick={handleInvoicePDF}
            >
                <Icon icon='pdf' size={[24, 24]}></Icon>
            </Button>
        
        <div style={{display:'none'}}>
            <div ref={componentRef} >
                <Container
                    direction={'column'}
                    width={'100%'}
                    flexGrow={'1'}
                    padding={'24px'}
                    alignItem={'start'}
                    borderRadius={'8px'}
                    className='shadow'
                    gap={'16px'}
                    id='invoice'
                >
                    {info}
                    <Container
                        padding={'0px'}
                        direction={'row'}
                        gap={'16px'}
                        alignItem={'start'}
                        justifyContent={'start'}
                        width={'100%'}
                    >
                        
                        {customer}
                        {billStatus}
                    </Container>
                    {products}
                    {payments}
                </Container>
                
            </div>
        </div>
        </>
    )
 }