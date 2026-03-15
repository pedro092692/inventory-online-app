'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import { Button } from '@/app/ui/utils/button/buttons'
import Route from '@/app/ui/routesLinks/routes'
import styles from './input.module.css'
import { useState } from 'react'
import { errorHandler } from '@/app/errors/fetchDataErrorHandler'
import fetchData from '@/app/utils/fetchData'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default function AddProduct() {
    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState(null)
    const [name, setName] = useState('')
    const [barcode, setBarcode] = useState('')
    const [purchasePrice, setPurchasePrice] = useState('')
    const [sellingPrice, setSellingPrice] = useState('')
    const [stock, setStock] = useState('')

    const addProduct = async () => {
        if (!name, !barcode, !purchasePrice, !sellingPrice, !stock) return

        return await errorHandler( async () => {
            setErrors(null)
            const endpoint = '/api/products'
            const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
            const data = await fetchData(url, 'POST', { name, barcode, purchasePrice, sellingPrice, stock })
            if (data) {
                setMessage('Producto agregado con éxito')
                setName('')
                setBarcode('')
                setPurchasePrice('')
                setSellingPrice('')
                setStock('')
                setTimeout(() => {
                    setMessage(null)
                }, 2000)
            }
        }, null, setErrors, 'Hubo un error al agregar el producto')
    }

    return (
        <>  
            <Route path='products' endpoints={['default', 'add']} />
            <Form className={`${styles.form} shadow`}  onSubmit={(e) => {e.preventDefault(); addProduct();}}>
                <Input type="text" placeHolder="Nombre del producto" icon="product" 
                   onChange={(e) => setName(e.target.value)} value={name} name={'name'} capitalize={true}/>
                <Input type="text" placeHolder="Código de barras" icon="barcode" 
                   onChange={(e) => setBarcode(e.target.value)} value={barcode} name={'barcode'}/>

            </Form>
        </>
    )

}

