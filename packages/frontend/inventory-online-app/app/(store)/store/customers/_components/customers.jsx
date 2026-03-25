import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import List from '@/app/ui/list/list'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Customers({ limit = 10, page = 1, query = null, queryString = null}){
 
    const enpoint = query ? '/api/customers/search' : '/api/customers/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()
    
    if (query){
        params.append('data', query)
        params.append('limitResults', limit)
        params.append('page', page)
    }else{
        params.append('limit', limit)
        params.append('page', page)
    }

    const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`

    const fetch = withErrorHandler(FetchData, 'hubo un error inesperado')

    const response = await fetch(url, 'GET')
    
    const {data, error} = response
    const rawData = data?.customers || []
    const userPermissions = data?.permissions || []
    
    
    const transformData = (customers) => {
        let data = []
        if (customers.length > 0) {
            data = customers.map(customer => (
                {
                    name: customer.name,
                    id_number: new Intl.NumberFormat('es-Ve').format(customer.id_number),
                    phone: customer.phone.startsWith('+5804') ? 
                        `${customer.phone.slice(3 ,7)}-${customer.phone.slice(7, 10)}-${customer.phone.slice(10, 12)}-${customer.phone.slice(12)}` 
                            : customer.phone,
                    id: customer.id,
                }
            ))
        }
        return data
    }
    
    const customer = transformData(rawData)

    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }
    
    return (
        <List
            tableHead={
                {
                    'nombre': 'Nombre',
                    'cedula': 'Cédula',
                    'teléfono': 'Teléfono',
                    'actions': 'Acciones'
                }
            }
            tableData={customer}
            showActions={true}
            params={rawParams}
            endpoint='customers'
            deleteKey={'customerId'}
            userPermissions={userPermissions}
            queryString={queryString}
            deleteMsg='Cliente eliminado con éxito'
        />
    )    
} 