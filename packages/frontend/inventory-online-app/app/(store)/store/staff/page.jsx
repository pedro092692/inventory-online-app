import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Pagination from '@/app/ui/pagination/pagination'
import Request from '@/app/utils/request'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default function Cashiers() {
    const endpoint = ''
    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='staff' endpoints={['add', 'default']}  /> 
        </Container>
    )
}