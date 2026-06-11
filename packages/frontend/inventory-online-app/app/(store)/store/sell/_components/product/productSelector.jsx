'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState, useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import InputWithIcon from '@/app/ui/customers/searchAndSelect/input/inputWithIcon'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import ProductResultContainer from '@/app/(store)/store/sell/_components/product/productContainer'

export default function ProductSelector({placeHolder='Buscar Producto Por Nombre O Código De Barras'}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState(null)

    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
        handleSearch(value)
    }

    const endpoint = `products/search`
    const params = new URLSearchParams()
    
    // add params to url
    params.append('data', query)
    params.append('limit', 8)
    params.append('page', 1)
    const url = `${endpoint}?${params.toString()}`

    const handleSearch = useDebouncedCallback(async (term) => {
        if(term) {
           const response = await GetItemAction(url)
           const {data, error} = response
           setResults(data?.products || [])
        }else{
            setResults([])
        }
    }, 300)

    console.log(results)
    return (
        <>
            {/* input search */}
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder}/>
            <ProductResultContainer/>
            {/* <div>
                {results.length > 0 && results.map(product => {
                    return (
                        <p key={product.id}>{product.name} - {product.selling_price}$</p>
                    )
                })}
            </div> */}
        </>
    )
}   