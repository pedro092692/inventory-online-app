import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/products/products.module.css'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'
import { Container } from '@/app/ui/utils/container'

export default async function Products({ limit = 10, page = 1, query = null, queryString = null, sortBy = null, sortDir = null}){
    const enpoint = query ? 'products/search' : 'products/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()

    params.append('limit', limit)
    params.append('page', page)
    if (query){
        params.append('data', query)
    }
    if (sortBy){
        params.append('sortBy', sortBy)
        params.append('sortDir', sortDir || 'asc')
    }

    const url = `${enpoint}?${params.toString()}`
    
    const response = await GetItemAction(url)
    
    const {data, error} = response
    const rawData = data?.products || []
    const userPermissions = data?.permissions || []
    let tableHead = {
        nombre: 'Nombre',
        barcode: 'Código De Barras',
        purchase_price: 'Precio de compra $',
        selling_price: 'Precio De Venta $',
        selling_price_bs: 'Precio De Venta Bs',
        stock: 'Stock',
        actions: 'Acciones'
    }
    const transformData = (products, inclucePurchasePrice = false) => {
        let data = []
        if (products.length > 0) {
            data = products.map(product => (
                {
                    name: product.name,
                    barcode: product.barcode,
                    purchase_price: `${product.purchase_price} $`,
                    selling_price: `${product.selling_price} $`,
                    selling_price_bs: 
                        new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(product.reference_selling_price),
                    stock: product.stock,
                    id: product.id
                }
            ))

            if (!inclucePurchasePrice){
                data.map((item) => {
                    delete item.purchase_price
                    delete item.id
                })
                delete tableHead.purchase_price
                delete tableHead.actions
            }
            
        }
        return data
    }

    
    const products = transformData(rawData, userPermissions.includes('update') ? true : false)

    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }

    return (
        <>
            {
                products.length > 0 || query
                ?
            
            <List
                tableHead={tableHead}
                tableData={products}
                showActions={true}
                params={rawParams}
                endpoint='products'
                userPermissions={userPermissions}
                queryString={queryString}
                deleteKey={'productId'}
                deleteMsg='Producto eliminado con éxito'
                showView={false}
                customClass={styles.table}
                rowClassName={(rowData) => rowData.stock === 0 ? styles.notStockRow : rowData.stock <= 5 ? styles.lowStockRow : ''}
                sortableColumns={{ selling_price: 'selling_price', stock: 'stock' }}
                sortBy={sortBy}
                sortDir={sortDir}
                basePath='/store/products'
                sortParams={query ? new URLSearchParams({ data: query }).toString() : ''}
            />
            :
            <Container
                    direction={'column'}
                    gap={'4px'}
                    width={'100%'}
                >
                    <p className='p1-b'>No tienes a ningún producto 📦 en la base de datos.</p>
                    <p className='p1-b'>Agrega uno nuevo para vender.</p>
                    <Link href={'/store/products/add'}>
                        <Button showIcon={true} type={'secondary'} icon='circlePlus' children='Agregar Un Producto Nuevo.'
                        className='p3-r shadow'/>
                    </Link>
            </Container>
            }
        
        </>
    )
}