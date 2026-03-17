'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function Search ({ 
    placeHolder="Buscar...", 
    inputMode=null,
}) {

    const { replace} = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.get('data') || ''

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
                    onChange={(e) => { handleInputChange(e); handleSearch(e.target.value)}}
                    defaultValue={query}
                    value={searchTerm}
                    inputMode={inputMode}
            />
        </Form>
    )
}