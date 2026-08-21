import { Container } from '@/app/ui/utils/container'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import Request from '@/app/utils/request'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function User({searchParams}) {
    return (
            <Container
                direction={'column'}
                alignItem={'start'}
                padding='0px'
                width='100%'
            >
            
                <Search 
                    placeHolder="Buscar usuario por correo"
                />
               
                
            </Container>
           
        )
}