'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState, useRef, useEffect, useMemo, useImperativeHandle } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import ProductResultContainer from '@/app/(store)/store/sell/_components/product/productContainer'

export default function ProductSelector({placeHolder='Buscar Producto Por Nombre O Código De Barras',
    setItems=() => '',
    items=[],
    activeScreen=null,
    changes=[],
    setChanges=() => '',
    autoFocus=true,
    ref=null

    }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [isScanning, setIsScanning] = useState(false)
    const [showNoResults, setShowNoResults] = useState(false)
    const lastKeyTime = useRef(0)
    const showResultsRef = useRef(null)
    const inputRef = useRef(null)

    const endpoint = `products/search`
    const params = new URLSearchParams()

    // add params to url
    params.append('data', query)
    params.append('limit', 8)
    params.append('page', 1)
    params.append('stock', true)
    const url = `${endpoint}?${params.toString()}`

    const handleInputChange = (e) => {
        const now = Date.now()
        const delta = now - lastKeyTime.current
        const value = e.target.value
        // check if time is less than 30ms
        if (delta < 30) {
            setIsScanning(true)
        }else {
            setIsScanning(false)
        }

        // update last key time
        lastKeyTime.current = now

        setQuery(value)

        handleSearch(value)
    }

    const handleSearch = useDebouncedCallback(async (term) => {
        // check if there is products with zero quantity
        checkZeroQuantityProducts()

        if(term) {
            const response = await GetItemAction(url)
            const {data, error} = response
            setResults(data?.products || [])

            // check if product is scanning and add it to cart automatically
            if (data?.products.length == 1 && isScanning) handleClick(data?.products[0])

            // highligh first result
            if (highlightedIndex == -1) {
                setHighlightedIndex(0)
            }
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
        // check if item no exits..
        const item = items.find(item => item.id === product.id)
        if (item) {
            const newQuantity = item.quantity + 1 > product.stock
                ? product.stock
                : item.quantity + 1

            setItems(prev => prev.map(item => {
                if (item.id !== product.id ) return item
                return {...item, quantity: newQuantity}
            }))
            setResults([])
            setQuery('')
            if(changes.length > 0) {
                setChanges([])
            }
            return
        }

        product['quantity'] = 1
        setItems(prev => [...prev, product])
        setResults([])
        setQuery('')
    }

    const checkZeroQuantityProducts = () => {
        const productsNoQuantity = items.filter(item => item.quantity === "")
        if (productsNoQuantity.length > 0) {
            setItems(prev => prev.map(item => {
                if (item.quantity === "") return {...item, quantity: 1}
                return item

            }))
        }
    }

    const handleKeyDown = (e) => {
        if (results.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : 0
            )
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightedIndex(prev =>
                prev > 0 ? prev - 1 : results.length - 1
            )
        }

        if (e.key === 'Enter' && highlightedIndex >=0) {
            e.preventDefault()
            setHighlightedIndex(-1)
            handleClick(results[highlightedIndex])
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (activeScreen === 'products') {
            inputRef.current?.focus()
        }
    }, [activeScreen])

    useEffect(() => {
        if (query && results.length === 0) {
            const timer = setTimeout(() => {
                setShowNoResults(true)
            }, 500)
            return () => clearTimeout(timer)
        }else {
            setShowNoResults(false)
        }

    }, [query, results])

    // Lets a parent (e.g. the Alt+C "cart mode" shortcut) return focus to the
    // search box explicitly, since leaving cart mode doesn't itself change
    // activeScreen and so wouldn't otherwise re-trigger the effect above.
    useImperativeHandle(ref, () => ({
        focusInput: () => inputRef.current?.focus()
    }), [])

    return (
        <>
            {/* input search */}
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder} onKeyDown={handleKeyDown}
                inputRef={inputRef}
                bgColor='white'
                autoFocus={autoFocus}
            />
            { results.length > 0 && <ProductResultContainer
                ref={showResultsRef}
                results={results}
                onClick={handleClick}
                highlightedIndex={highlightedIndex}
                />
            }

            {
                showNoResults && (
                    <p style={{ padding: '8px', color: '#888' }}>
                         No se encontraron productos paras "{query}"
                    </p>
                )
            }
        </>
    )
}
