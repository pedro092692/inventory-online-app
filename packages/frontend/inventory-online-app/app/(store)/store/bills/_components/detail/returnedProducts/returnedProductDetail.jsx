import GetItemAction from '@/app/lib/actions/get'
import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import styles from './returned.module.css'

export default async function ReturnedInvoiceProducts({ id, limit = 8, page = 1, totalProductPages = 0 }) {
    const endpoint = `invoice-returns/returned-products/${id}`
    const params = new URLSearchParams()
    params.append('limitReturn', limit)
    params.append('pageReturn', page)

    const url = `${endpoint}?${params.toString()}`

    const response = await GetItemAction(url)
    const { data, error } = response
    const returnedProducts = data?.returnedProducts || []
    const products = returnedProducts.map(product => {
        return {
            name: product?.invoice_detail?.products?.name || 'Undefined',
            quantity: product?.quantity || 0,
            amountReturned: `${product?.amount_returned} $` || 0,
            dateReturned: new Date(product?.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })
        }
    })
    
    // await new Promise(resolve => setTimeout(resolve, 1000))
    return (
       <>
       {
        returnedProducts ?
        <Container
            width={'100%'}
            padding={'16px'}
            direction={'column'}
            alignItem={'start'}
            justifyContent={'start'}
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            className='shadow'
        >   
            <Container
                padding={'8px'}
            >
                
            <p className='p1-b'>Productos devueltos de la factura: #{id}</p>
            
            </Container>
            <List
                tableHead={{
                    'name': 'Producto',
                    'quantity': 'Cantidad',
                    'amountReturned': 'Monto devuelto',
                    'dateReturned': 'Fecha de devolución'
                }}
                customClass={styles.table}
                tableData={products}
                showActions={false}
            />
            <Pagination totalPages={totalProductPages} paramName={'pageReturn'}/>
        </Container>
        :
        <p>Orden no encontrada...</p>
       }
       </>
    )
}
