'use client'
import { useState, useEffect } from 'react'
import Route from "@/app/ui/routesLinks/routes"
import { useSearchParams } from 'next/navigation'
import { Form } from '@/app/ui/form/form/form'
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
    const [reference_selling_price, setReference_selling_price] = useState('')
    const [stock, setStock] = useState('')
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
                setReference_selling_price(data.reference_selling_price)
                setStock(data.stock)
            }
        }, setLoading, setNotFound, 'Producto no encontrado')
    }

    useEffect(() => {
        productInfo()
    }, [])

    return (
        <>
            <Route path='products' endpoints={['default', 'view', 'edit']} customPage={true} page={page} search={search}/> 
            <Form>
                <Input type="text" placeHolder="Nombre del producto" icon="product" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : name} name={'name'} capitalize={true}/>
                
                <Input type="text" placeHolder="Código de barras" icon="product" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : barcode} name={'barcode'} />

                <Input type={loading ? "text" : "number"} placeHolder="Precio de compra $" icon="dollar" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : purchase_price} name={'purchase_price'} />
    
                <Input type={loading ? "text" : "number"} placeHolder="Precio de venta $" icon="dollar" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : selling_price} name={'selling_price'} />

                <Input type={loading ? "text" : "number"} placeHolder="Precio de venta Bs" icon="dollar" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : reference_selling_price} name={'reference_selling_price'} />

                <Input type={loading ? "text" : "number"} placeHolder="Stock" icon="product" 
                onChange={(e) => {}}
                value={loading ? 'Cargando...' : stock} name={'stock'} />
            </Form>
        </>
    )
}