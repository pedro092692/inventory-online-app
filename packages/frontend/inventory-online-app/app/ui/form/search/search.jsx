'use client'
import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'
import { useDebouncedCallback } from 'use-debounce'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import GetPageParam from '@/app/utils/getPageParam'
import { useState } from 'react'

export default function Search ({ placeHolder="Buscar...", searchFn, limit=10, offset=0, setOffset, value='' }) {

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const [searchTerm, setSearchTerm] = useState(value ? value : '')

    const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        setOffset(0)
        if (term) {
            params.set('search', term)
            searchFn(term, limit, 0)
        }else {
            params.delete('search')
            searchFn(term, limit, offset)
        }

        replace(`${pathname}?${params.toString()}`)
    }, 300)
    
    return (
        <Form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <Input  type="search" 
                    name="search" 
                    placeHolder={placeHolder} 
                    icon="search" 
                    className={styles.input}
                    autoFocus={true}
                    onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value)}}
                    defaultValue={searchParams.get('search')?.toString()}
                    value={searchTerm}
            />
        </Form>
    )
}