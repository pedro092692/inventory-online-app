import FetchData from '@/app/utils/fetch'
import { withErrorHandler } from '@/app/errors/withErrorHandler'
import ProductDetailForm from '@/app/(store)/store/products/_components/detail/productDetailForm'
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function ProductInfo({id}){
    const endpoint = `/api/products/${id}`
    const url = `${NEXT_PUBLIC_API_BASE_URL}${endpoint}`
    const fetch = withErrorHandler(FetchData, 'Hubo un error inesperado intententa nuevamente')
    const response = await fetch(url, 'GET')
    const {data, error} = response

    const product = data?.product || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return (
        <ProductDetailForm product={product}/>
    )
}