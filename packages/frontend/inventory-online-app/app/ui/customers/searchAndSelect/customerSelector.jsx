'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState, useRef, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import inputStyles from './input.module.css'
import InputWithIcon from '@/app/ui/customers/searchAndSelect/input/inputWithIcon'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import SearchResultsContainer from '@/app/ui/customers/searchAndSelect/results/searchResults'


export default function CustomerSelector({value, onChange, placeHolder='Buscar cliente por Nombre, Cédula', showResult=true, bgColor, activeScreen=null}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [error, setError] = useState(null)
    const showResultsRef = useRef(null)
    const inputRef = useRef(null)

    const endpoint = `customers/search`
    const params = new URLSearchParams()
    
    // add params to url
    params.append('data', query)
    params.append('limitResults', 6)
    params.append('page', 1)
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
            if (error) {setError(error)} else setError(null)
            setResults(data?.customers || [])
        }else{
            setResults([])
        }

    }, 300)

    const handleClick = (selectedValue) => {
        onChange(selectedValue) 
        setResults([])
        setQuery('') 
    }

    const handleClickOutside = (event) => {
        if (showResultsRef.current && !showResultsRef.current.contains(event.target)) {
            setResults([])
            setQuery('')
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [value])

    useEffect(() => {
        if (activeScreen === 'customer') {
            inputRef.current?.focus()
        }
    }, [activeScreen])

    return (
        <Container
            padding={'0px'}
            direction={'column'}
            justifyContent={'start'}
            alignItem={'start'}
            width={'100%'}
            className={inputStyles.father}
        >
            {/* input search */}
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder} bgColor={bgColor} inputRef={inputRef}/>

            {/* show results  */}
            <SearchResultsContainer ref={showResultsRef} results={results} onClick={handleClick}/>
            
            
            {error &&  <p className='p2-r errorMsg'>{error}</p>}
            
            {value && showResult &&(
                <>
                    <InputWithIcon value={value.name} icon="person" name={'name'}/>
                    <InputWithIcon value={value.id_number} icon="id" name={'id_number'}/>
                    <InputWithIcon value={value.phone} icon="phone" name={'phone'}/>
                </>
                )
            }
        </Container>
    )

}