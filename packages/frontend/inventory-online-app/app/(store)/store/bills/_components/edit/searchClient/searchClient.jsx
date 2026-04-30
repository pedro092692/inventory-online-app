'use client'
import { Input } from '@/app/ui/form/input/input'                       
import { useState, useEffect } from 'react'
import GetItemAction from '@/app/lib/actions/get'

export default function ClientSearchInput({ defaultCustomer, customerId }) {
    const [query, setQuery] = useState(defaultCustomer?.name || '')
    const [results, setResults] = useState([])
    const [selected, setSelected] = useState(defaultCustomer || null)
    const [loading, setLoading] = useState(false)
   
    

    useEffect(() => {
       
        if (query.length < 2) {
            setResults([])
            return
        }
        const enpoint = 'customers/search' 
        const params = new URLSearchParams()
        params.append('data', query)
        params.append('limitResults', 6)
        params.append('page', 1)
        const url = `${enpoint}?${params.toString()}`

        
        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const response = await GetItemAction(url)
                const {data, error} = response
                setResults(data.customers || [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }, 200)

        return () => clearTimeout(timer)   
    }, [query])

    const handleSelect = (client) => {
        setSelected(client)
        setQuery(client.name)
        setResults([])                     
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Input hidden para mandar el id en el form */}
            <input type="hidden" name="customer_id" value={selected?.id || ''} />

            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setSelected(null)      // si edita, resetea la selección
                }}
                placeholder="Buscar cliente..."
            />

            {loading && <span>Buscando...</span>}

            {results.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    background: 'white',
                    border: '1px solid #ccc',
                    width: '100%',
                    zIndex: 10,
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                }}>
                    {results.map(client => (
                        <li
                            key={client.id}
                            onClick={() => handleSelect(client)}
                            style={{ padding: '8px', cursor: 'pointer' }}
                        >
                            {client.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}