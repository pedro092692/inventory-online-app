'use client'
import { Form } from '@/app/ui/form/form/form'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import ReturnInvoceItemAction from '@/app/lib/actions/returnProductAction'
import { useActionState, useState, useMemo } from 'react'
import InvoiceProducts from '@/app/(store)/store/bills/_components/edit/invoiceDetails/invoiceProducts'
import InvoiceHeader from '@/app/(store)/store/bills/_components/edit/invoiceDetails/invoiceHeader'
import InvoiceBasicDetails from '@/app/(store)/store/bills/_components/edit/invoiceDetails/invoiceBasicDetails'
import ProductToReturn from '@/app/(store)/store/bills/_components/edit/invoiceDetails/productsToReturn'
import styles from './invoice.module.css'


export default function ProductDetailForm({invoice=null, totalProductPages = 1, queryString = ''}) {
    const [info, setInfo] = useState({productsToReturn: [], productsData: []})
    const [quantityToReturn, setQuantityToReturn] = useState({})
    
    const originalValues = {
        products: invoice?.products || []
    }
    
    const initialSte = {message: null, inputs: originalValues, errors: {}}
    
    const returnItems = ReturnInvoceItemAction.bind(null, 'invoice-details/', 'Nota de crédito guardada con éxito')
    const [state, formAction, isPending] = useActionState(returnItems, initialSte)
    
    const handleReturnProduct = (data) => {
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
            {/* header */}
            <InvoiceHeader invoice={invoice}/>
            
            {/* invoice basic info */}
            <InvoiceBasicDetails invoice={invoice}/>
            
            {/* invoice products   */}
            <InvoiceProducts invoice={invoice} totalProductPages={totalProductPages} onClick={handleReturnProduct} 
                onChange={setQuantityToReturn}
            />
            

            {/* products to return */}
            <ProductToReturn products={info.productsData} totalToReturn={totalToReturn} />
            
            
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
                {isPending ? 'Generando...' : 'Generar Nota de crédito'}
            </Button>
            
        </Form>    
    )
}