import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import Request from '@/app/utils/request'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Users from '@/app/(admin)/admin/users/_components/users'

export default async function User({searchParams}) {
    const params = await searchParams
    const query = params?.data || null
    const currentPage = Number(params?.page) || 1
    const response = await Request(`users/total-pages${query ? `?data=${query}` : ''}`, 'GET', null, 'Hubo un error inesperado intententa nuevamente')
    const {data, error} = response 
    const totalPages = data?.total || 1


    return (
            <Container
                direction={'column'}
                alignItem={'start'}
                padding='0px'
                width='100%'
            >
                <Link href={'/admin/users/add'}>
                    <Button showIcon={true} type={'secondary'} icon='circlePlus' children='Agregar Un Nuevo Usuario' 
                        className='p3-r shadow'/>
                </Link>
                <Search 
                    placeHolder="Buscar por correo o nombre de tienda"
                />

                <Suspense key={query + currentPage} fallback={<ListSkeleton nTitle={4} />}>
                    <Users page={currentPage} query={query}/>
                </Suspense>

                {
                    error ? 
                    (    
                        <p className='p2-r errorMsg'>{error}</p>
                    ) 
                    : 
                    (
                        <Pagination totalPages={totalPages} />
                    )
                }
               
                
            </Container>
           
        )
}