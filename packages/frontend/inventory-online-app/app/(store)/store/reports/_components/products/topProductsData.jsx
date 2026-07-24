import GetItemAction from '@/app/lib/actions/get'
import TopProductsReport from '@/app/(store)/store/reports/_components/products/topProducts'

export default async function TopProducts() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'top-selling-products'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const products = data


    return (
       <TopProductsReport topProducts={products} />
    )   
}