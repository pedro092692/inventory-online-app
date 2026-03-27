import Request from '@/app/utils/request'
import ProductDetailForm from '@/app/(store)/store/products/_components/detail/productDetailForm'

export default async function ProductInfo({id}){
    const endpoint = `products/${id}`
    const response = await Request(endpoint, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response

    const product = data?.product || null
    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }
    return (
        <ProductDetailForm product={product}/>
    )
}