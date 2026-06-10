import List from '@/app/ui/list/list'
import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import styles from '../invoice.module.css'
export default function ProductToReturn({ products, totalToReturn=0, onClick=null }) {
    if (!products ) return null

    const customButton = (data) => {
        return (
            <Button 
                className={styles.returnInput}
                children={false}
                showIcon={true}
                type={'danger'}
                icon={'trash'}
                size={[16, 16]}
                style={{padding: '4px'}}
                title={'Deshacer'}
                onClick={() => onClick(data, true)}
            />
        )
    }
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
                        'actions': 'Acciones'
                    }}
                    showActions={true}
                    showDelete={false}
                    showEdit={false}
                    showView={false}
                    custonActionButton={(data) => customButton(data)}
                    customClass={styles.tableReturnedProducts}
                    tableData={products}
                />
                <p className='p1-b'>Total a devolver: {totalToReturn} $</p>
            </Container>
        }
        </>
        
    )
}