import Link from 'next/link'
import { Container } from '../utils/container'


export default function Route({path='customers', endpoints=['default', 'add'], queryString='' }) {
    const endpoint = `/store/${path}`
    const withParams = (url) => {
        return queryString ? `${url}?${queryString}` : url
    }

    const routes = {
        customers: {
            default: {
                href: withParams(endpoint),
                label: 'Clientes'
            },
            add: {
                href: `${endpoint}/add`,
                label: 'Agregar cliente'
            },

            detail: {
                href: `${endpoint}/detail/[id]`,
                label: 'Detalle del cliente'
            },

            edit: {
                href: `${endpoint}/edit/[id]`,
                label: 'Editar cliente'
            }
        },

        products: {
            default: {
                href: withParams(endpoint),
                label: 'Productos'
            },
            add: {
                href: `${endpoint}/add`,
                label: 'Agregar producto'
            },
            edit: {
                href: `${endpoint}/edit/[id]`,
                label: 'Editar producto'

            }
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
                        {index < endpoints.length -1 && '/'}
                    </Container>
                        
                )
            }
                
            )}
        </Container>
    )
}