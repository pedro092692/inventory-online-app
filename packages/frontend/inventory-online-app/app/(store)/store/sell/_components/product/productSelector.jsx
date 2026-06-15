'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState, useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import InputWithIcon from '@/app/ui/customers/searchAndSelect/input/inputWithIcon'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import ProductResultContainer from '@/app/(store)/store/sell/_components/product/productContainer'

export default function ProductSelector({placeHolder='Buscar Producto Por Nombre O Código De Barras', setItems=() => ''}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const showResultsRef = useRef(null)

    const endpoint = `products/search`
    const params = new URLSearchParams()
    
    // add params to url
    params.append('data', query)
    params.append('limit', 8)
    params.append('page', 1)
    params.append('stock', true)
    const url = `${endpoint}?${params.toString()}`
    
    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
        handleSearch(value)
    }

    const handleSearch = useDebouncedCallback(async (term) => {
        if(term) {
           const response = await GetItemAction(url)
           const {data, error} = response
           setResults(data?.products || [])
        }else{
            setResults([])
        }
    }, 300)

    const handleClickOutside = (event) => {
        if (showResultsRef.current && !showResultsRef.current.contains(event.target)) {
            setResults([])
            setQuery('')
        }
    }

    const handleClick = (product) => {
        product['quantity'] = 1
        setItems(prev => [...prev, product])
        setResults([])
        setQuery('')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <>
            {/* input search */}
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder}/>
            { results.length > 0 && <ProductResultContainer ref={showResultsRef} results={results} onClick={handleClick}/> }
        </>
    )
}   