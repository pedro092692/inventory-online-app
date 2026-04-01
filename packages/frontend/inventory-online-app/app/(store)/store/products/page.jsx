import { Container } from '@/app/ui/utils/container'
import Route from '@/app/ui/routesLinks/routes'
import Search from "@/app/ui/form/search/search"
import Pagination from '@/app/ui/pagination/pagination'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import Products from './_components/products'
import GetItemAction from '@/app/lib/actions/get'
import { buildQueryParams } from '@/app/utils/buildQueryParams'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'

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
          
              <Route path='products' endpoints={['add', 'default']} /> 
              <Link href='/store/products/bulk'>
                <Button type='secondary' size='sm'>Carga Masiva de productos</Button>
              </Link>
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
                    <Pagination totalPages={totalPages} />
                )
              }
          </Container>
         
      )
  }



