import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import List from '@/app/ui/list/list'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Customers({ limit = 10, page = 1, query = null}){
    const enpoint = query ? '/api/products/search' : '/api/products/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()

    params.append('limit', limit)
    params.append('page', page)
    if (query){
        params.append('data', query)
    }

    const url = `${NEXT_PUBLIC_API_BASE_URL}${enpoint}?${params.toString()}`
    const fetch = withErrorHandler(FetchData, 'hubo un error inesperado')
    
    const response = await fetch(url, 'GET')
    
    const {data, error} = response
    const rawData = data?.products || []
    const userPermissions = data?.permissions || []
    let tableHead = {
        nombre: 'Nombre',
        barcode: 'Código De Barras',
        purchase_price: 'Precio de compra $',
        selling_price: 'Precio De Venta $',
        selling_price_bs: 'Precio De Venta Bs',
        stock: 'Stock',
        actions: 'Acciones'
    }
    const transformData = (products, inclucePurchasePrice = false) => {
        let data = []
        if (products.length > 0) {
            data = products.map(product => (
                {
                    name: product.name,
                    barcode: product.barcode,
                    purchase_price: `${product.purchase_price} $`,
                    selling_price: `${product.selling_price} $`,
                    selling_price_bs: 
                        new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.reference_selling_price),
                    stock: product.stock,
                    id: product.id
                }
            ))

            if (!inclucePurchasePrice){
                data.map((item) => {
                    delete item.purchase_price
                    delete item.id
                })
                delete tableHead.purchase_price
                delete tableHead.actions
            }
            
        }
        return data
    }

    
    const products = transformData(rawData, userPermissions.includes('update') ? true : false)

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <List
            tableHead={tableHead}
            tableData={products}
            showActions={true}
            params={rawParams}
            endpoint='products'
            userPermissions={userPermissions}
            deleteKey={'productId'}
            showView={false}
        />
    )
}