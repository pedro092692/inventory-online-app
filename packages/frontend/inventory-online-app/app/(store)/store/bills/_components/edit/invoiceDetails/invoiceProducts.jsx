import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import styles from '../invoice.module.css'

export default function InvoiceProducts({ invoiceData, totalProductPages, onClick=null}) {
     const customButton = (data) => {
        return (
            <Button 
                className={styles.returnInput}
                children={false}
                showIcon={true}
                type={'secondary'}
                icon={'circlePlus'}
                size={[16, 16]}
                style={{padding: '4px'}}
                title={'Devolver producto'}
                onClick={() => onClick(data)}
            />
        )
    }
    
    return (
        <Container
            width={'100%'}
            padding={'16px'}
            direction={'column'}
            alignItem={'start'}
            borderRadius={'8px'}
            backgroundColor={'var(--color-neutralGrey300)'}
            className='shadow'
        >
            {
                invoiceData.length > 0 ?
                <>
                    <List 
                        tableHead={{
                            'name': 'Producto',
                            'quantity': 'Unidades',
                            'unitPriceBs': 'Precio unitario (Bs)',
                            'uniPriceDollar': 'Precio unitario ($)',
                            'unitsToreturn': 'Unidades a devolver',
                            'actions': 'Acciones'
                        }}
                        tableData={invoiceData}
                        showActions={true}
                        showDelete={false}
                        showEdit={false}
                        showView={false}
                        deleteKey={'itemId'}
                        endpoint={'invoice-details'}
                        deleteMsg={'El producto se ha retornado con éxito'}
                        customClass={styles.tableProducts}
                        cancelSupervisor={true}
                        custonActionButton={(data) => customButton(data)}
                    />
                    <Pagination totalPages={totalProductPages} paramName={'pageProducts'}/> 
                </>
                :
                <p>Esta order de compra no tienes productos asociados...</p>
            }
        </Container>
    )
}
