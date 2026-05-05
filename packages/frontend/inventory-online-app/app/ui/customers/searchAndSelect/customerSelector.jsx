'use client'
import GetItemAction from '@/app/lib/actions/get'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import inputStyles from './input.module.css'
import InputWithIcon from '@/app/ui/customers/searchAndSelect/input/inputWithIcon'
import SearchCustomerInput from '@/app/ui/customers/searchAndSelect/input/searchInput'
import SearchResultsContainer from '@/app/ui/customers/searchAndSelect/results/searchResults'


export default function CustomerSelector({value, onChange, placeHolder='Buscar cliente por Nombre, Cédula'}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState(null)
    const [error, setError] = useState(null)

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
        setSelected(selectedValue) 
        setResults([])
        setQuery('') 
    }

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
            <SearchCustomerInput query={query} onChange={handleInputChange} placeHolder={placeHolder}/>

            {/* show results  */}
            <SearchResultsContainer results={results} onClick={handleClick}/>
            
            
            {error &&  <p className='p2-r errorMsg'>{error}</p>}
            
            {(value || selected) && (
                <>
                    <InputWithIcon value={selected?.name ?? value.name} icon="person" name={'name'}/>
                    <InputWithIcon value={selected?.id_number ?? value.id_number} icon="id" name={'id_number'}/>
                    <InputWithIcon value={selected?.phone ?? value.phone} icon="phone" name={'phone'}/>
                </>
                )
            }
        </Container>
    )

}