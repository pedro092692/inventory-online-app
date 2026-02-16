'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Search ({ 
    placeHolder="Buscar...", 
    searchFn=null, 
    limit=10, 
    offset=0, 
    setOffset=null, 
    queryValueParam='', 
    inputMode=null,
    setURLParam=true
}) {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [searchTerm, setSearchTerm] = useState(queryValueParam ? queryValueParam : '')

    const handleInputChange = (e) => {
        if (inputMode === 'numeric') {
            const inputValue = e.target.value
            if (inputValue === "" || /^[0-9\b]+$/.test(inputValue)) {
                setSearchTerm(inputValue)
            }
            return
        }

        setSearchTerm(e.target.value)
    }

    const handleSearch = useDebouncedCallback((term) => {
        if (!searchFn) return
        const params = new URLSearchParams(searchParams)
        {setURLParam && params.set('page', '1')}
        setOffset(0)
        if (term) {
            {setURLParam && params.set('search', term)}
            searchFn(limit, 0, term)
        }else {
            params.delete('search')
            searchFn(limit, offset, term)
        }

        replace(`${pathname}?${params.toString()}`)
    }, 300)
    
    return (
        <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <Input  
                    type="search" 
                    name="search" 
                    placeHolder={placeHolder} 
                    icon="search" 
                    className={styles.input}
                    autoFocus={true}
                    onChange={(e) => { handleInputChange(e); handleSearch(e.target.value)}}
                    defaultValue={searchParams.get('search')?.toString()}
                    value={searchTerm}
                    inputMode={inputMode}
            />
        </Form>
    )
}