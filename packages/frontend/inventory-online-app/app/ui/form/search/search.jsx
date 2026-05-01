'use client'
// import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function Search ({ 
    placeHolder="Buscar...", 
    paramName="data",
    inputMode=null,
    page_param='page'

}) {

    const { replace} = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.get(paramName) || ''
    const [value, setValue] = useState(query)
    
    useEffect(() => {
        setValue(query)
    }, [query])

    const handleInputChange = (e) => {
        const value = e.target.value
        if(inputMode === 'number') {
            if(value === '' || /^[0-9]+$/.test(value)){
                setValue(value)
                handleSearch(value)

            }
            return
        }
        setValue(value)
        handleSearch(value)

    }

      const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(page_param, '1')
        if (term) {
            const cleanTerm = term.trim().replaceAll('.', '').replace(/\s+/g, ' ')
            params.set(paramName, cleanTerm)
        }else {
            params.delete(paramName)
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)
    
    return (
        // <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <Input  
                    type="search" 
                    name="search" 
                    placeHolder={placeHolder} 
                    icon="search" 
                    className={styles.input}
                    autoFocus={true}
                    onChange={(e) => handleInputChange(e)}
                    value={value}
                    inputMode={inputMode}
            />
        // {/* </Form> */}
    )
}