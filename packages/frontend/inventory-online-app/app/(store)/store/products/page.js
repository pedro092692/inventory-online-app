'use client'
import axios from 'axios'
import { useEffect, useState } from 'react';


export default function Home() {

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
    })
    

  return (
    <>
      <h1>Productos</h1>
      <div>
        <div>
            <p >Productos </p>
            {products.map((product, index) => {
                return (
                    <ul key={index}>
                        <li>{product.name} - ${product.selling_price} stock: {product.stock}</li>
                    </ul>
                )
            })}
        </div>
      </div>
    </>
  )
}
