'use client'
import { useState, useEffect } from 'react'
import Route from "@/app/ui/routesLinks/routes"
import { useSearchParams } from 'next/navigation'
import { Form } from '@/app/ui/form/form/form'
import { Button } from '@/app/ui/utils/button/buttons'
import { Input } from '@/app/ui/form/input/input'
import GetParam from '@/app/utils/getParam'
import fetchData from '@/app/utils/fetchData'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function EditProduct() {
    const search = useSearchParams()?.get('search') || ''
    const page = useSearchParams()?.get('page') || 1
    const [id, setId] = useState(GetParam('id') || '')
    const [notFound, setNotFound] = useState('')
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [barcode, setBarcode] = useState('')
    const [purchase_price, setPurchase_price] = useState('')
    const [selling_price, setSelling_price] = useState('')
    const [stock, setStock] = useState('')
    const [field, setField] = useState({name: {isEdited: false}, barcode: {isEdited: false}, 
        purchase_price: {isEdited: false}, selling_price: {isEdited: false}, stock: {isEdited: false}})
    const [errors, setErrors] = useState('')
    const [message, setMessage] = useState('')

    //get product info 
    const productInfo = async () => {
        const endpoint = `/api/products/${id}`
        const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`

        return await errorHandler( async () => {
            const data = await fetchData(url, 'GET')
            if (data) {
                setBarcode(data.barcode)
                setName(data.name)
                setPurchase_price(data.purchase_price)
                setSelling_price(data.selling_price)
                setStock(data.stock)
            }
        }, setLoading, setNotFound, 'Producto no encontrado')
    }

    useEffect(() => {
        productInfo()
    }, [])

    return (
        <>
            <Route path='products' endpoints={['default', 'edit']} customPage={true} page={page} search={search}/> 
            <Form className={'form-edit'} onSubmit={(e) => {e.preventDefault();}} style={{padding: "16px"}}>
                
                
                <label>Nombre del producto</label>
                <Input type="text" placeHolder="Nombre del producto" icon="product" 
                onChange={(e) => {setName(e.target.value); setField({...field, name:{isEdited: true}})}}
                value={loading ? 'Cargando...' : name} name={'name'} capitalize={true}/>
                
                <label>Codigo de barras</label>
                <Input type="text" placeHolder="Código de barras" icon="barcode" 
                onChange={(e) => {setBarcode(e.target.value); setField({...field, barcode:{isEdited: true}})}}
                value={loading ? 'Cargando...' : barcode} name={'barcode'} />

                <label>Precio de compra $</label>
                <Input type={loading ? "text" : "number"} placeHolder="Precio de compra $" icon="dollar" 
                onChange={(e) => {setPurchase_price(e.target.value); setField({...field, purchase_price:{isEdited: true}})}}
                value={loading ? 'Cargando...' : purchase_price} name={'purchase_price'} />
    
                <label>Precio de venta $</label>
                <Input type={loading ? "text" : "number"} placeHolder="selling_price" icon="selling_price" 
                onChange={(e) => {setSelling_price(e.target.value); setField({...field, selling_price:{isEdited: true}})}}
                value={loading ? 'Cargando...' : selling_price} name={'selling_price'} />
                
                <label>Stock</label>
                <Input type={loading ? "text" : "number"} placeHolder="Stock" icon="boxes" 
                onChange={(e) => {setStock(e.target.value); setField({...field, stock:{isEdited: true}})}}
                value={loading ? 'Cargando...' : stock} name={'stock'} />
                
                {/* send form */}
                <Button role="submit" type="secondary">
                    Editar producto
                </Button>
                
                {/* not found error */}
                {notFound && <span style={{color: 'red'}}>{notFound}</span>}

                {/* success message */}
                {message && <span style={{color: 'green', marginTop: '8px'}}>{message}</span>}
            </Form>
        </>
    )
}