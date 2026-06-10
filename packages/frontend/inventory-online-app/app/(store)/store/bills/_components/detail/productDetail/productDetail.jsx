import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import styles from './product.module.css'
import Link from 'next/link'
import { Button } from '@/app/ui/utils/button/buttons'
import GetItemAction from '@/app/lib/actions/get'

export default async function ProductDetails({ productsDetails, invoice_id, queryString='', getProducts=false}){
    let productsInfo = []
    if (!productsDetails && getProducts && invoice_id) {
        const endpoint = `invoices/${invoice_id}`
        const params = new URLSearchParams()
        params.append('paginated', 'false')
        const url = `${endpoint}?${params.toString()}`
        const response = await GetItemAction(url)
        productsInfo = response?.data?.invoice?.products.length > 0 ? response?.data?.invoice?.products : []
        
    }
    
    const products = formatProductsDetails(!productsDetails ? productsInfo : productsDetails) || []
    const source = productsDetails.length > 0 ? productsDetails : productsInfo
    const hasReturns = source.some(product => parseInt(product.total_quantity_returned))
    
    function formatProductsDetails(productsDetails) {
        return productsDetails.map(product => {
            return {
                name : `${product.products.name} 
                    ${parseInt(product.total_quantity_returned) > 0 ? 
                      parseInt(product.total_quantity_returned) >= parseInt(product.quantity) ?
                      '🔴' : '🟡' : ''
                    }`,
                price: new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(product.unit_price),
                quantity: product.quantity,
                total: Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(
                    product.unit_price * product.quantity),
            }
        })
    }
    return (
        <>
        {products.length > 0 ?
            <Container
                direction={'column'}
                width={'100%'}
                padding={'0px'}
                alignItem={'start'}
                // backgroundColor={'blue'}
            >
                <h3 className='p1-r'>Detalles de productos</h3>
            
                
                <List
                    tableHead={{
                        name: 'Nombre',
                        price: 'Precio Unitario',
                        quantity: 'Cantidad',
                        total: 'Total',
                    }}
                    tableData={products}
                    showActions={false}
                    customClass={styles.table}
                    CustomStyles={{borderRadius: '0px 0px 8px 8px', height: 'fit-content'}}
                />
                
                {
                    hasReturns && (
                        <Container
                            padding="0px"
                            width="100%"
                            justifyContent="space-between"
                        >
                            <p className="p2-r">
                                Ítem con devolución parcial 🟡 Ítem con devolución completa 🔴
                            </p>

                            <Link href={`/store/bills/detail/return/${invoice_id}${queryString ? `?${queryString}&fromInvoice=1` : '?&fromInvoice=1'}`}>
                                <Button
                                    type="grey"
                                    style={{ backgroundColor: 'var(--color-blue700)', padding: '8px' }}
                                    title="Editar factura"
                                >
                                    <span className="p2-b" style={{ color: 'var(--color-neutralWhite)' }}>
                                        Ver devoluciones
                                    </span>
                                </Button>
                            </Link>
                        </Container>
                    )
                }
            </Container>
            :
            <p className='fieldError'>Hubo un error inesperado. Intenta más tarde...</p>
        }
        </>
    )
}

