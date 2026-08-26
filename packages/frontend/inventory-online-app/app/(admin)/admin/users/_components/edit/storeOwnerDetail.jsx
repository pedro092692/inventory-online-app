import Request from '@/app/utils/request'
import StoreOwnerDetailForm from '@/app/(admin)/admin/users/_components/edit/editStoreOwnerForm'

export default async function StoreOwnerInfo({id}) {
    const endpoint = `users/store-owner/${id}`
    const response = await Request(endpoint, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    return (
        <StoreOwnerDetailForm user={data?.user} seller={data?.seller} />
    )
}