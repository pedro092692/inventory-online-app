import GetItemAction from '@/app/lib/actions/get'
import WorstProductsReport from '@/app/(store)/store/reports/_components/products/worstProducts'

export default async function WorstProducts() {
    // await new Promise (r => setTimeout(r, 1000))
    const endpoint = 'worst-selling-products'
    const url = `reports/${endpoint}`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const products = data


    return (
       <WorstProductsReport worstProducts={products} />
    )   
}