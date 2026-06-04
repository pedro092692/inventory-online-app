'use client'
import { Form } from '@/app/ui/form/form/form'
import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import ReturnInvoceItemAction from '@/app/lib/actions/returnProductAction'
import { useActionState, useState, useMemo } from 'react'
import InvoiceProducts from '@/app/(store)/store/bills/_components/edit/invoiceDetails/invoiceProducts'
import InvoiceHeader from '@/app/(store)/store/bills/_components/edit/invoiceDetails/invoiceHeader'
import styles from './invoice.module.css'


export default function ProductDetailForm({invoice=null, totalProductPages = 1, queryString = ''}) {
    const [info, setInfo] = useState({productsToReturn: [], productsData: []})
    const [quantityToReturn, setQuantityToReturn] = useState({})
    
    const originalValues = {
        products: invoice?.products || []
    }
    const initialSte = {message: null, inputs: originalValues, errors: {}}

    const inputMsg = 'Cantidad a retornar'
    
    const productUnitPrice = (product) => invoice?.exchange_rate ? ((product?.unit_price || 0) / invoice.exchange_rate).toFixed(2) : 0
    
    const returnInput = (product) => <Input name='quantity' key={product?.id}icon='circleArrow' type='number' style={{height: '20px'}} min={1} 
                            max={product?.quantity || 1} placeHolder={inputMsg} 
                            onChange={(e) => { setQuantityToReturn(prev => ({...prev, [product?.id]: e.target.value})) }} 
                            required={false}
                            className={styles.inputNumber} />

    const returnItems = ReturnInvoceItemAction.bind(null, 'invoice-details/', 'Nota de crédito guardada con éxito')
    const [state, formAction, isPending] = useActionState(returnItems, initialSte)
    
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
    
   
   

    const handleReturnProductButton = (data) => {
        const extraQuantity = parseInt(quantityToReturn[data.id] || 0, 10)
        
        const newQuantity = (item, data, extraQuantity) => {
            return (parseInt(item.returnedQuantity, 10) + extraQuantity) > data.quantity 
                ? data.quantity
                : parseInt(item.returnedQuantity, 10) + extraQuantity
        }

        if (extraQuantity <= 0 ) return 

        setInfo(prev => {
            const itemExits = prev.productsToReturn.find(item => item.itemId === data.id)
            if (itemExits) {
                return {
                    ...prev,
                    productsToReturn: prev.productsToReturn.map(item => {                        
                        if (item.itemId !== data.id) return item
                             
                            return {
                                ...item,
                                returnedQuantity: newQuantity(item, data, extraQuantity)
                            }
                        
                    }),
                    productsData: prev.productsData.map(itemInfo => {
                        if (itemInfo.id !== data.id) return itemInfo
                            
                            return {
                                ...itemInfo,
                                returnedQuantity: newQuantity(itemInfo, data, extraQuantity),
                                total: (newQuantity(itemInfo, data, extraQuantity) * itemInfo.unitPrice).toFixed(2)
                            }
                        
                    }) 
                }   
            }else {
                return {
                    ...prev,
                    productsToReturn: [
                        ...prev.productsToReturn,
                        {
                            itemId: data.id,
                            returnedQuantity: extraQuantity
                        },
                    ],
                    productsData: [
                        ...prev.productsData,
                        {
                            name: data.name,
                            unitPrice: data.unitPriceDollar,
                            returnedQuantity: extraQuantity,
                            total: (data.unitPriceDollar * extraQuantity).toFixed(2),
                            id: data.id
                        }
                    ]
                }
            }
        })
        
    } 
   
    const totalToReturn = useMemo(() => {
        return info.productsData.reduce((acc, item) => {
            return acc + (item.returnedQuantity * item.unitPrice)
        }, 0).toFixed(2)
    }, [info.productsData])     

  
    
    return (
        <Form className={styles.form} style={{padding: '16px', flexGrow: '0'}} action={formAction}>
            {/* title */}
            <InvoiceHeader invoice={invoice}/>
            
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

                {/* invoice products   */}
                <InvoiceProducts invoiceData={invoiceData} totalProductPages={totalProductPages} onClick={handleReturnProductButton}/>
            
            </Container>

            {/* products to return */}
            {info.productsData.length > 0 &&
                <>
                <List
                    tableHead={{
                        'name': 'Producto',
                        'uniPriceDollar': 'Precio unitario ($)',
                        'quantity': 'Unidades a devolver',
                        'total': 'Total credito a devolver',
                    }}
                    tableData={info.productsData}
                    showActions={false}
                />
            <p>Total a devolver: {totalToReturn} $</p>
                </>       
            }
            <input type="hidden" 
                name="itemsToReturn" 
                value={JSON.stringify(info.productsToReturn)}
            />
            
                <input 
                    type="hidden" 
                    name="pin"
                    value="1234"
                />
            <Button role="submit" type="secondary">
                {isPending && <OvalLoader/>}   
                {isPending ? 'Guardando...' : 'Editar Orden de compra'}
            </Button>
            
        </Form>    
    )
}