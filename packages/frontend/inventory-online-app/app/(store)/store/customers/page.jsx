import { Container } from "@/app/ui/utils/container"
import Route from '@/app/ui/routesLinks/routes'
import Search from "@/app/ui/form/search/search"
import Pagination from "@/app/ui/pagination/pagination"
import FetchData from "@/app/utils/fetch"
import { Suspense } from "react" 
import ListSkeleton from "@/app/ui/skeleton/listSkeleton"
import Customers from "./_components/customers"
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1'

export default async function Customer({searchParams}) {
    const params = await searchParams
    const query = params?.data || null
    const currentPage = Number(params?.page) || 1
    const totalPages = await FetchData(`${NEXT_PUBLIC_API_BASE_URL}/api/customers/total-pages${query ? `?data=${query}` : '' }`, 'GET')


    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
        
            <Route path='customers' endpoints={['add', 'default']} /> 
            <Search 
                placeHolder="Buscar cliente por Nombre, Cédula"
            />
            <Suspense key={query + currentPage} fallback={<ListSkeleton nTitle={4} />}>
                <Customers page={currentPage} query={query} />
            </Suspense>
            <Pagination totalPages={totalPages.total} />
        </Container>
       
    )
}