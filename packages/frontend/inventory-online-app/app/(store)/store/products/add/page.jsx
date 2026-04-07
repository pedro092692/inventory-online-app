import { buildQueryParams } from '@/app/utils/buildQueryParams'
import Route from '@/app/ui/routesLinks/routes'
import AddProductForm from '@/app/(store)/store/products/_components/add/addProductForm'
import AddBulkProductsForm from '@/app/(store)/store/products/_components/bulk/addBulkProductsForm'
import { Container } from '@/app/ui/utils/container'

export default async function AddProduct({searchParams}) {
    const urlParams = await searchParams
    const queryString = buildQueryParams(urlParams, ['page', 'data'])

    return (
        <>
            <Route path='products' endpoints={['default', 'add']} queryString={queryString}/> 
            <Container
                width={'100%'}
                padding={'16px 12px'}
                alignItem={'start'}
                justifyContent={'start'}
                gap={'40px'}
                className='shadow'
                borderRadius={'8px'}
            >
                <Container
                    // backgroundColor={'pink'}
                    width={'100%'}
                    padding={'4px'}
                    direction={'column'}
                    alignItem={'start'}
                    gap={'0px'}
                >
                    <h2 className='p1-b'>Agregar Un Producto Individual</h2>
                    <AddProductForm/>
                </Container>
                
                <Container
                    padding={'0px'}
                    backgroundColor={'#D2D3D3'}
                    width={'2px'}
                    height={'100%'}
                >
                    <span></span>
                </Container>

                <Container
                    // backgroundColor={'pink'}
                    width={'100%'}
                    padding={'4px'}
                    direction={'column'}
                    alignItem={'start'}
                    gap={'0px'}
                >
                    <h2 className='p1-b'>Carga Masiva De Productos</h2>
                    <AddBulkProductsForm />
                </Container>
            </Container>
        </>          
   )
}