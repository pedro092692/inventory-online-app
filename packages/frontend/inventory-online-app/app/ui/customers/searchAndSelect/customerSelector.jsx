'use client'
import GetItemAction from '@/app/lib/actions/get'
import { Input } from '@/app/ui/form/input/input'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Container } from '@/app/ui/utils/container'
import { Icon } from '@/app/ui/utils/icons/icons'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import inputStyles from './input.module.css'



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
            if (error) setError(error)
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
            // backgroundColor={'red'}
        >
            {/* input search */}
            <Container
                padding={'0px 0px 0px 16px'}
                backgroundColor={'var(--color-neutralGrey300)'}
                width='100%'
                gap={'0px'}
                borderRadius='8px'
                justifyContent='start'
            >
                <Icon icon={'search'} color='black'/>
                <input 
                    className={`p2-r ${inputStyles.input}`}
                    style={{background: 'var(--color-neutralGrey300)'}}
                    type="search" 
                    name="search" 
                    placeholder={placeHolder} 
                    icon="search" 
                    autoFocus={true}
                    onChange={(e) => handleInputChange(e)}
                    value={query}

                />
            </Container>
            

            {/* show results  */}
            {results.length > 0 && 
                <Container
                    padding={'0px'}
                    gap={'2px'}
                    direction={'column'}
                    alignItem={'start'}
                    justifyContent={'start'}
                    // backgroundColor={'blue'}
                >
                    {results.map((customer) => {
                        return (
                            <p 
                                key={customer.id}
                                onClick={() => handleClick(customer) }
                            >
                                {customer.name}
                            </p>
                        )
                    })}
                </Container>
            }
            
            {error &&  <p className='p2-r errorMsg'>{error}</p>}
            
            {(value || selected) && (
                <>
                    <Input type="text" icon="person" value={selected?.name ?? value.name} name={'name'} className={styles.inputReadOnly} readOnly={true}/>
                    <Input type="text" icon="id" value={selected?.id_number ?? value.id_number} name={'id_number'} className={styles.inputReadOnly} readOnly={true}/>
                    <Input type="text" 
                        icon="phone" value={selected?.phone ?? value.phone} name={'phone'} className={styles.inputReadOnly} />  
                </>
                )
            }
        </Container>
    )

}