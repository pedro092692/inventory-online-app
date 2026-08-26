import StoreOwnerInfo from '@/app/(admin)/admin/users/_components/edit/storeOwnerDetail'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'

export default async function EditStoreOwner({ params }) {
    const { id } = await params

    return (
        <>
            <h1 className='h3'>Editar tienda</h1>

            <Suspense key={id} fallback={<FormSkeleton nFields={6}/>}>
                <StoreOwnerInfo id={id} />
            </Suspense>
        </>
    )
}