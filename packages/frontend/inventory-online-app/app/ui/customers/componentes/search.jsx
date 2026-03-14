'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function SearchTest() {
    const { replace} = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.get('data') || ''

    const handleSearch = (e) => {
        const params = new URLSearchParams(searchParams)
        const value = e.target.value
        if (value) {
            params.set('data', value)
        }else {
            params.delete('data')
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div>
            <input type="text" defaultValue={query} onChange={handleSearch} placeholder='nombre'/>
        </div>
    )
    
}