import { Container } from '@/app/ui/utils/container'
import List from '@/app/ui/list/list'
import styles from './product.module.css'

export default function ProductDetails({ productsDetails }){
    const products = formatProductsDetails(productsDetails)
    console.log(products)
    function formatProductsDetails(productsDetails) {
        return productsDetails.map(product => {
            return {
                name : product.name,
                price: new Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(product.invoice_details.unit_price),
                quantity: product.invoice_details.quantity,
                total: Intl.NumberFormat('es-VE', {style: 'currency', currency: 'VES'}).format(
                    product.invoice_details.unit_price * product.invoice_details.quantity),
            }
        })
    }
    return (
        <Container
            direction={'column'}
            width={'100%'}
            padding={'0px'}
            alignItem={'start'}
            // backgroundColor={'blue'}
        >
            <h3 className='p1-r'>Detalles de productos</h3>
           
            {
                <List
                    tableHead={{
                        name: 'Nombre',
                        price: 'Precio Unitario',
                        quantity: 'Cantidad',
                        total: 'Total',
                    }}
                    tableData={products}
                    showActions={false}
                    customClass={styles.table}
                    CustomStyles={{borderRadius: '0px 0px 8px 8px', height: 'fit-content'}}
                />
            }
        </Container>
    )
}

