'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import { OvalLoader } from '@/app/ui/loader/spinner'
import { useActionState, useState, useEffect } from 'react'

export default function ProductDetailForm({product}) {
    
    return (
        <>
            {product &&
                <Form className={'form-edit'} style={{padding: "16px"}}>
                
                <label>Nombre del producto</label>
                <Input type="text" placeHolder="Nombre del producto" icon="product" 
                defaultValue={product.name}
                capitalize={true}/>
                
                <label>Codigo de barras</label>
                <Input type="text" placeHolder="Código de barras" icon="barcode" 
                defaultValue={product.barcode} name={'barcode'} />

                <label>Precio de compra $</label>
                <Input type="text" placeHolder="Precio de compra $" icon="dollar" 
                defaultValue={product.purchase_price}
                name={'purchase_price'} />
    
                <label>Precio de venta $</label>
                <Input type="text" placeHolder="selling_price" icon="selling_price" 
                defaultValue={product.selling_price}
                name={'selling_price'} />
                
                <label>Stock</label>
                <Input type="text" placeHolder="Stock" icon="boxes" 
                defaultValue={product.stock}
                name={'stock'} />
                
                {/* send form */}
                <Button role="submit" type="secondary">
                    Editar producto
                </Button>
            </Form>
            }
        </>
    )  
}