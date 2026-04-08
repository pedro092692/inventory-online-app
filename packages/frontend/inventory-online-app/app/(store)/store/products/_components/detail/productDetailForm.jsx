'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import EditItemAction from '@/app/lib/actions/edit'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function ProductDetailForm({product}) {
    const originalValues = {
        name: product?.name,
        barcode: product?.barcode,
        purchase_price: product?.purchase_price,
        selling_price: product?.selling_price,
        stock: product?.stock
    }

    const initialSte = {message: null, inputs: originalValues, errors: {}}
    const updateProduct = EditItemAction.bind(null, `products/${product?.id}`, 
        ['name', 'barcode', 'purchase_price', 'selling_price', 'stock'], 'Producto editado con éxito')
    const [state, formAction, isPending] = useActionState(updateProduct, initialSte)
    const [field, setField] = useState({name: {isEdited: false,}, barcode: {isEdited: false}, 
                                        purchase_price: {isEdited: false}, selling_price: {isEdited: false}, stock: 
                                        {isEdited: false}})
    const hasChanges = 
                field.name.isEdited ||
                field.barcode.isEdited ||
                field.purchase_price.isEdited ||
                field.selling_price.isEdited ||
                field.stock.isEdited

    const handleSubmit = (formData) => {
        if(!hasChanges) return 
        return formAction(formData)
    }

    useEffect(() => {
        const success = state?.message 
        if (success) {
            setField({
                name: {isEdited: false},
                barcode: {isEdited: false},
                purchase_price: {isEdited: false},
                selling_price: {isEdited: false},
                stock: {isEdited: false}
            })
        }
    }, [state]) 
    

    return (
        <>
            {product &&
                <Form className={'form-edit'} style={{padding: "16px"}} action={handleSubmit}  >
                
                <label>Nombre del producto</label>
                <Input type="text" placeHolder="Nombre del producto" icon="product" 
                defaultValue={state.inputs?.name ?? product.name} name={'name'} 
                onChange={() => setField({...field, name: {isEdited: true}})}
                capitalize={true}/>

                {state?.errors?.name && <span className="field_error">{state?.errors?.name}</span>}
                
                <label>Codigo de barras</label>
                <Input type="text" placeHolder="Código de barras" icon="barcode" 
                defaultValue={state.inputs?.barcode ?? product.barcode}
                onChange={() => setField({...field, barcode: {isEdited: true}})}
                name={'barcode'} />

                {state?.errors?.barcode && <span className="field_error">{state?.errors?.barcode}</span>}
                

                <label>Precio de compra $</label>
                <Input type="text" placeHolder="Precio de compra $" icon="dollar" 
                defaultValue={state.inputs?.purchase_price ?? product.purchase_price}
                onChange={() => setField({...field, purchase_price: {isEdited: true}})}  
                name={'purchase_price'} />

                {state?.errors?.purchase_price && <span className="field_error">{state?.errors?.purchase_price}</span>}
    
                <label>Precio de venta $</label>
                <Input type="text" placeHolder="Precio De Venta $" icon="selling_price" 
                defaultValue={state.inputs?.selling_price ?? product.selling_price}
                onChange={() => setField({...field, selling_price: {isEdited: true}})}
                name={'selling_price'} />
                
                {state?.errors?.selling_price && <span className="field_error">{state?.errors?.selling_price}</span>}
                
                <label>Stock</label>
                <Input type="text" placeHolder="Stock" icon="boxes" 
                defaultValue={state.inputs?.stock ?? product.stock}
                onChange={() => setField({...field, stock: {isEdited: true}})}
                name={'stock'} />
                
                {state?.errors?.stock && <span className="field_error">{state?.errors?.stock}</span>}
                    
                {state?.errors?.error && <span className="field_error">{state?.errors?.error}</span>}

                {state?.message && <span style={{color: 'green', marginTop: '8px'}}>{state?.message}</span>}

                {/* send form */}
                <Button role="submit" type="secondary">
                    {isPending && <OvalLoader/>}   
                    {isPending ? 'Guardando...' : 'Editar Producto'}
                </Button>
            </Form>
            }
        </>
    )  
}