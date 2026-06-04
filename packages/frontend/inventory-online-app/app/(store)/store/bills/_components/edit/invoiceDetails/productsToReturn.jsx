import List from '@/app/ui/list/list'
import { Container } from '@/app/ui/utils/container'
import styles from '../invoice.module.css'
export default function ProductToReturn({products, totalToReturn=0}) {
    if (!products ) return null
    return(
        <>
        {
            products.length > 0 &&
            <Container
                width={'100%'}
                padding={'16px'}
                direction={'column'}
                alignItem={'start'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey100)'}
                className='shadow'
            >   
                <p className='p1-b'>Productos a devolver:</p>
                <List
                    tableHead={{
                        'name': 'Producto',
                        'uniPriceDollar': 'Precio unitario ($)',
                        'quantity': 'Unidades a devolver',
                        'total': 'Total credito a devolver',
                    }}
                    customClass={styles.tableReturnedProducts}
                    tableData={products}
                    showActions={false}
                />
                <p className='p1-b'>Total a devolver: {totalToReturn} $</p>
            </Container>
        }
        </>
        
    )
}