import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from "@/app/ui/form/search/search"
import Pagination from '@/app/ui/pagination/pagination'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Products from './_components/products'
import GetItemAction from '@/app/lib/actions/get'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import ExportProductForm from '@/app/(store)/store/products/_components/export/exportForm'

export default async function Product({searchParams}) {
  const params = await searchParams
  const query = params?.data || null
  const currentPage = Number(params?.page) || 1
  const queryString = buildQueryParams(params, ['page', 'data'])
  const response = await GetItemAction(`products/total-pages${query ? `?data=${query}` : '' }`, 'Hubo un error inesperado intenta nuevamente')
  const {data, error} = response 
  const totalPages = data?.total || 1

     return (
          <Container
              direction={'column'}
              alignItem={'start'}
              padding='0px'
              width='100%'
          >
          
              <Route path='products' endpoints={['add', 'default']} queryString={queryString} /> 
              <Search 
                placeHolder="Buscar producto por Nombre, Código De Barras"
              />
              <Suspense key={query + currentPage} fallback={<ListSkeleton nTitle={7} />}>
                  <Products page={currentPage} query={query} queryString={queryString}/>
              </Suspense>
              {
                error ? 
                (    
                    <p className='p2-r errorMsg'>{error}</p>
                ) 
                : 
                (
                    <Container
                        padding={'0px'}
                        width={'100%'}
                        justifyContent={'space-between'}
                    >
                        <Pagination totalPages={totalPages} />

                        <ExportProductForm/>
                        
                    </Container>
                )
              }
              
          </Container>
         
      )
  }



