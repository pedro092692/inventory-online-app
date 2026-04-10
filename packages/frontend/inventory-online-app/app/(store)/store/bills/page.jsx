import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from '@/app/ui/form/search/search'
import Pagination from '@/app/ui/pagination/pagination'
import Request from '@/app/utils/request'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import { buildQueryParams } from '@/app/utils/buildQueryParams'

export default async function Bills({searchParams}) {
   const params = await searchParams
   const query = params?.data || null
   const queryString = buildQueryParams(params, ['page', 'data'])
   const currentPage = Number(params?.page) || 1
   const response = null
   const { data, error } = response || {}
   const totalPages = data?.total || 1

    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
            <Route path='bills' endpoints={['add', 'default']} queryString={queryString}/>
        </Container>
    )
}