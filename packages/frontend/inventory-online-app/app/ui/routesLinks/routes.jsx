import Link from 'next/link'
import { Container } from '../utils/container'

export default function Route({path='customers', endpoints=['default', 'add']}) {
    const routes = {
        customers: {
            default: {
                href: '/store/customers',
                label: 'Clientes'
            },
            add: {
                href: '/store/customers/add',
                label: 'Agregar cliente'
            },
            view: {
                href: '/store/customers/view',
                label: 'Todos los clientes'
            },

            detail: {
                href: '/store/customers/view/detail/[id]',
                label: 'Detalle del cliente'
            },
        },

        products: {
            default: {
                href: '/store/products',
                label: 'Productos'
            },
            view: {
                href: '/store/products/view',
                label: 'Todos los productos'
            },
        }
    }
    
    return (
        <Container
            padding='0'
        > 
            {endpoints.map((endpiont, index) => {
                return (
                    <Container
                    padding='0'
                    key={index}
                        
                    > 
                    {index < endpoints.length -1 ?
                        <Link
                            href={routes[path][endpiont].href}
                            key={index}
                        >
                            {routes[path][endpiont].label}
                        </Link>
                        :
                        <p style={{cursor: 'default', color: 'var(--color-neutralGrey800)'}}>{routes[path][endpiont].label}</p>
                        
                    }
                        {index < endpoints.length -1 && '-'}
                    </Container>
                        
                )
            }
                
            )}
        </Container>
    )
}