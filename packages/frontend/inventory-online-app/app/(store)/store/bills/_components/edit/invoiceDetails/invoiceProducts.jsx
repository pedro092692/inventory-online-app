import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'
import { Button } from '@/app/ui/utils/button/buttons'
import { Container } from '@/app/ui/utils/container'
import { Input } from '@/app/ui/form/input/input'
import styles from '../invoice.module.css'

export default function InvoiceProducts({ invoice=null, totalProductPages, onClick=null, onChange=null, 
                                            setErrors=null, inputErrors=null}) {
    if(!invoice) return null

    
    const inputMsg = 'Cantidad a retornar'
    const productUnitPrice = (product) => invoice?.exchange_rate ? ((product?.unit_price || 0) / invoice.exchange_rate).toFixed(2) : 0
    const returnInput = (product) => 
                        {
                            return(
                                <>
                                {
                                    product?.quantity - parseInt(product?.total_quantity_returned) !== 0 
                                ?
                                    <Input name='quantity' 
                                    key={product?.id} 
                                    id={product?.id} 
                                    icon='circleArrow' type='number' 
                                    style={{height: '20px', borderRadius: '0px'}} 
                                    min={1} 
                                    max={product?.quantity - parseInt(product?.total_quantity_returned) || 1} 
                                    placeHolder={inputMsg} 
                                    onChange={(e) => {  setErrors(prev => ({ ...prev, [product?.id]: false})); 
                                                        onChange(prev => ({...prev, [product?.id]: e.target.value})) }} 
                                    required={false}
                                    disable={product?.quantity - parseInt(product?.total_quantity_returned) === 0 ? true : false }
                                    className={`${styles.inputNumber} ${inputErrors[product?.id] ? styles.returnInputError : ''}`} />
                                :
                                    <p className={'field_error p2-r'} style={{paddingLeft: '16px'}}>Sin stock para devolver</p>
                                }
                                </>
                            )
                        }
    
    const invoiceData = invoice?.products.map((product) => {
        return {
            name: product?.products?.name || 'Undefined',
            quantity: product?.quantity || 0,
            unitPriceBs: product?.unit_price || 0,
            unitPriceDollar: productUnitPrice(product),
            unitsToreturn: returnInput(product),
            id: product?.id || null,
        
        }
    }) || []
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
                        endpoint={'invoice-details'}
                        customClass={styles.tableProducts}
                        cancelSupervisor={true}
                        custonActionButton={(data) => customButton(data)}
                        noRenderKeys={['alredayReturned']}
                    />
                    <Pagination totalPages={totalProductPages} paramName={'pageProducts'}/> 
                </>
                :
                <p>Esta order de compra no tienes productos asociados...</p>
            }
        </Container>
    )
}
