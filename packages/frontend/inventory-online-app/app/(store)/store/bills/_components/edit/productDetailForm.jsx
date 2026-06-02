'use client'
import { Form } from '@/app/ui/form/form/form'
import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import Pagination from '@/app/ui/pagination/pagination'
import { useState } from 'react'
import styles from './invoice.module.css'


export default function ProductDetailForm({invoice=null, page = 1, totalProductPages = 1, queryString = ''}) {
    const [productsToReturn, setProductsToReturn] = useState([])
    const [productsToReturnInfo, setProductsToReturnInfo] = useState([])
    const [quantityToReturn, setQuantityToReturn] = useState({})
    const [totalMoneyToReturn, setTotalMoneyToReturn] = useState(0)
    
    const invoiceProducts = invoice?.products.map((product) => {
        return {
            name: product?.products?.name || 'Undefined',
            quantity: product?.quantity || 0,
            unitPriceBs: product?.unit_price || 0,
            unitPriceDollar: invoice?.exchange_rate ? ((product?.unit_price || 0) / invoice.exchange_rate).toFixed(2) : 0,
            unitsToreturn: <Input name='quantity' 
                            key={product?.id}
                            icon='circleArrow' type='number' 
                            style={{height: '20px'}} 
                            min={1} 
                            max={product?.quantity || 1}
                            // value={quantityToReturn[product?.id] || 0}
                            placeHolder='Cantidad a retornar'
                            onChange={(e) => {
                                setQuantityToReturn(prev => ({
                                    ...prev,
                                    [product?.id]: e.target.value
                                }))
                            }} 
                            className={styles.inputNumber}  />,
            id: product?.id || null,
        }
    }) || []
    
    const date = invoice?.date ? new Date(invoice.date).toISOString() : null
    const custonButton = (data) => {
        return (
            <Button 
                children={false}
                showIcon={true}
                icon={'trash'}
                type={'danger'}
                size={[16, 16]}
                title={'Devolver producto'}
                onClick={() => handleReturnProductButton(data)}
            />
        )
    }

    const handleReturnProductButton = (data) => {
        setProductsToReturn(prev => {
            const extraQuantity = parseInt(quantityToReturn[data.id] || 0, 10)
            if (extraQuantity <= 0 ) return prev

            const itemExist = prev.find(item => item.itemId === data.id)

            if (itemExist) {
                return prev.map(item => {
                    if (item.itemId === data.id) {
                        return {
                            ...item,
                            quantity: (parseInt(item.quantity, 10) + extraQuantity) > data.quantity ? data.quantity : parseInt(item.quantity, 10) + extraQuantity
                        }
                    }
                    return item
                })
            }else {
                return [
                    ...prev,
                    {
                        itemId: data.id,
                        quantity: extraQuantity
                    }
                ]
            }
        })

        setProductsToReturnInfo(prev => {
            const extraQuantity = parseInt(quantityToReturn[data.id] || 0, 10)
            if (extraQuantity <= 0 ) return prev

            const itemExist = prev.find(item => item.id === data.id)
            if (itemExist) {
                return prev.map(item => {
                    if (item.id === data.id) {
                        return{
                            ...item,
                            quantity: (parseInt(item.quantity, 10) + extraQuantity) > data.quantity ? data.quantity : parseInt(item.quantity, 10) + extraQuantity,
                            total: (parseInt(item.quantity, 10) + extraQuantity) > data.quantity ? (data.quantity * item.unitPrice).toFixed(2) : ((parseInt(item.quantity, 10) + extraQuantity) * item.unitPrice).toFixed(2)
                        }
                    }
                    return item
                })
            }else {
                return [
                    ...prev,
                    {
                        name: data.name,
                        unitPrice: data.unitPriceDollar,
                        quantity: extraQuantity,
                        total: `${(data.unitPriceDollar * extraQuantity).toFixed(2)} $`,
                        id: data.id,

                    }
                ]
            }
        })

    } 
        return (
        <Form className={styles.form} style={{padding: '16px', flexGrow: '0'}}>
            <Container
                width={'100%'}
                padding={'8px'}
                direction={'column'}
                alignItem={'start'}
                borderRadius={'8px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                className='shadow'
            >   
                <h2 className='h3'>Gestionar nota de crédito de la factura: #{invoice?.id}</h2>
                <Container
                    padding={'0px'}
                    width={'100%'}
                    justifyContent={'space-between'}
                >
                    <p>Fecha:</p>
                    <p className='p2'>{new Date(invoice?.date).toLocaleDateString('es-VE', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </Container>
                <p>Hora: {new Intl.DateTimeFormat('es-VE', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'UTC'
                }).format(new Date(date))}</p>
            </Container>
            
            {/* seller */}
            <Container
                padding={'0px'}
            >
                <h3 className='p2-b'>Vendedor:</h3>
                <p className='p2-r'>{invoice?.seller?.name || 'No tiene vendedor.'}</p>
            </Container>
            
            {/* customer */}
            <Container
                padding={'0px'}
            >
                <h3 className='p2-b'>Cliente:</h3>
                <p className='p2-r'>{invoice?.customer?.name || 'Error con el nombre del cliente.'}</p>
            </Container>

            {/* gran total */}
            <Container
                padding={'0px'}
            >
                <h3 className='p2-b'>Total:</h3>
                <p className='p2-r'>{`${invoice?.total} $` || 'Error en el monto.'}</p>
            </Container>
            
            {/* invoice item details */}
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
                invoiceProducts.length > 0 ?
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
                            tableData={invoiceProducts}
                            showActions={true}
                            showDelete={false}
                            showEdit={false}
                            showView={false}
                            deleteKey={'itemId'}
                            endpoint={'invoice-details'}
                            deleteMsg={'El producto se ha retornado con éxito'}
                            userPermissions={[]}
                            CustomStyles={{height: '280px', borderRadius: '8px'}}
                            customClass={styles.table}
                            cancelSupervisor={true}
                            custonActionButton={(data) => custonButton(data)}
                        /> 
                        <Pagination totalPages={totalProductPages} paramName={'pageProducts'}/>
                    </>
                    :
                    <p>Esta order de compra no tienes productos asociados...</p>
            }
            
            </Container>

            {/* products to return */}
            {productsToReturnInfo.length > 0 &&
                <List
                    tableHead={{
                        'name': 'Producto',
                        'uniPriceDollar': 'Precio unitario ($)',
                        'quantity': 'Unidades a devolver',
                        'total': 'Total credito a devolver',
                    }}
                    tableData={productsToReturnInfo}
                    showActions={false}
                />       
            }
            
        </Form>
        
        
            
    )
}