'use client'
import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import axios from 'axios'
import { useEffect, useState } from 'react'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'


export default function ViewProducts() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        // load products from the API
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:4000/api/products/all', {withCredentials: true})
                if(response.data){

                    setProducts(response.data);
                }else{
                    setProducts([]);
                }


            } catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                    console.log(error.response.data.message)
                }
                console.error(error)
            }
        }

        fetchProducts()
    }, [])
    

  return (
    <>
        <Title title="Products" icon={'product'}  />
        {products.map((product, index) => {
            return (
                <ul key={index}>
                    <li>{product.name} - ${product.selling_price} stock: {product.stock}</li>
                </ul>
            )
        })}
    </>
  )
}


