import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import AddProductForm from '@/app/(store)/store/products/_components/add/addProductForm'


export default async function AddProduct({searchParams}) {
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page', 'data'])

    return (
        <>
            <Route path='products' endpoints={['default', 'add']} queryString={queryString}/> 
            <AddProductForm/>
        </>          
   )
}