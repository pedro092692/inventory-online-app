'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function Search ({ 
    placeHolder="Buscar...", 
    inputMode=null,
}) {

    const { replace} = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    let query = searchParams.get('data') || ''
    const [value, setValue] = useState(query)

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
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        if (term) {
            params.set('data', term)
        }else {
            params.delete('data')
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
                    onChange={(e) => handleInputChange(e)}
                    defaultValue={query}
                    value={value}
                    inputMode={inputMode}
            />
        </Form>
    )
}