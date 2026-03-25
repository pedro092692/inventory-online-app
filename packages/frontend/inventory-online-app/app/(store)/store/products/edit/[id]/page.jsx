import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import ProductInfo from '@/app/(store)/store/products/_components/detail/productDetail'
import { Suspense } from 'react'

export default async function EditProduct({ params, searchParams }) {
    const { id } = await params
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page', 'data'])

    return (
        <>
            <Route path='products' endpoints={['default', 'edit']} queryString={queryString} />
            <Suspense key={id} fallback={<FormSkeleton nFields={5}/>}>
                <ProductInfo id={id}/>
            </Suspense>
        </>
    )
}