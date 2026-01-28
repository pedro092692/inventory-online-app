'use client'
import { Container } from '@/app/ui/utils/container'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'


export default function Products() {
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
        {/* // add new product  */}
        <Link href="#">Agregar un nuevo producto</Link>
        {/* view all products */}
        <Link href="/store/products/view">Lista de todos los productos</Link>

        {/* <Title title="Products" icon={'product'}  />
        {products.map((product, index) => {
            return (
                <ul key={index}>
                    <li>{product.name} - ${product.selling_price} stock: {product.stock}</li>
                </ul>
            )
        })} */}
    </>
  )
}



