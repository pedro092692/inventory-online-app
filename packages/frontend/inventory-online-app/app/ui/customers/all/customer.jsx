import FetchDataTest from '@/app/utils/fetch'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Customers({ limit = 10, offset = 0, query = null }){
 
    const enpoint = query ? '/api/customers/search' : '/api/customers/all'
    const params = new URLSearchParams()
    if (query){
        params.append('data', query)
        params.append('limitResults', limit)
        params.append('offsetResults', offset)
    }else{
        params.append('limit', limit)
        params.append('offset', offset)
    }

    const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`

    const response = await FetchDataTest(url, 'GET')
    const customers = response.customers

    return (
        <ul>
            {customers.map(customer => (
                <li key={customer.id}>
                    {customer.name}
                </li>
            ))}
        </ul>
    )
} 

