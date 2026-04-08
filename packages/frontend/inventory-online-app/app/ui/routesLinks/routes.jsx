import Link from 'next/link'
import { Container } from '../utils/container'
import { getCurrentUser } from '@/app/utils/getCurrentUser'


export default async function Route({path='customers', endpoints=['default', 'add'], queryString='' }) {
    const userInfo = await getCurrentUser()
    const endpoint = `/store/${path}`
    const withParams = (url) => {
        return queryString ? `${url}?${queryString}` : url
    }

    const routes = {
        customers: {
            default: {
                href: withParams(endpoint),
                label: 'Clientes',
                role: [1,2,3,4]
            },
            add: {
                href: `${endpoint}/add${queryString?`?${queryString}`: ''}`,
                label: 'Agregar cliente',
                role: [1,2,3,4]
            },

            detail: {
                href: `${endpoint}/detail/[id]`,
                label: 'Detalle del cliente',
                role: [1,2,3,4]
            },

            edit: {
                href: `${endpoint}/edit/[id]`,
                label: 'Editar cliente',
                role: [1,2,3]
            }
        },

        products: {
            default: {
                href: withParams(endpoint),
                label: 'Productos',
                role: [1,2,3,4]
            },
            add: {
                href: `${endpoint}/add${queryString?`?${queryString}`: ''}`,
                label: 'Agregar producto',
                role: [1,2,3]
            },
            edit: {
                href: `${endpoint}/edit/[id]`,
                label: 'Editar producto',
                role: [1,2,3,4]

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
                    {
                        routes[path][endpiont].role.includes(userInfo.role) ? (
                            <>
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
                            </>
                         ) : 
                         null
                    }
                    </Container>
                        
                )
            }
                
            )}
        </Container>
    )
}