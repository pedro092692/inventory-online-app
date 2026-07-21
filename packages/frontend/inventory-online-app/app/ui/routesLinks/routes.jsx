import Link from 'next/link'
import { Container } from '../utils/container'
import { getCurrentUser } from '@/app/utils/getCurrentUser'


export default async function Route({path='customers', endpoints=['default', 'add'], queryString='', id=null}) {
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
        },

        bills: {
            default: {
                href: withParams(endpoint),
                label: 'Ordenes de compra',
                role: [1,2,3,4]

            },
            add: {
                href: `${endpoint}/add${queryString?`?${queryString}`: ''}`,
                label: 'Crear Venta',
                role: [1,2,3,4]
            },
            detail: {
                href: `${endpoint}/detail/${id}${queryString?`?${queryString}`: ''}`,
                label: 'Detalle orden de compra',
                role: [1,2,3,4]
            },
            edit: {
                href: `${endpoint}/edit/`,
                label: 'Editar Orden de compra',
                role: [1,2,3]
            },
            
            editPayment: {
                href:`${endpoint}/edit/payment/[id]`,
                label: 'Gestionar metodos de pago',
                role: [1,2,3,4]
            },

            editProduct: {
                href:`${endpoint}/edit/product/${[id]}${queryString?`?${queryString}`: ''}`,
                label: 'Gestionar productos de la factura',
                role: [1,2,3,4]
            },

            viewReturnProducts: {
                href:`${endpoint}/detail/return/${id}`,
                label: 'Ver productos de la devolución',
                role: [1,2,3,4]
            },

            customer: {
                href:`/store/customers/detail/${queryString?.customer_id ? parseInt(queryString.customer_id) : 1}`,
                label: 'Detalle Cliente',
                role: [1,2,3,4]
            },

            staff: {
                href:`/store/staff/detail/${queryString?.seller_id ? parseInt(queryString.seller_id) : 1}`,
                label: 'Detalle Vendedor',
                role: [1,2,3,4]
            }
        },

        sell: {
            default: {
                href: withParams(endpoint),
                label: 'Ordenes de compra',
                role: [1,2,3,4]

            },
            
            add: {
                href: `${endpoint}${queryString?`?${queryString}`: ''}`,
                label: 'Nueva Venta',
                role: [1,2,3,4]
            },
        },

        staff: {
            default: {
                href: withParams(endpoint),
                label: 'Personal',
                role: [1,2]
            },

            add: {
                href: `${endpoint}/add${queryString?`?${queryString}`: ''}`,
                label: 'Agregar Personal',
                role: [1,2]
            },

            detail: {
                href: `${endpoint}/detail/[id]`,
                label: 'Detalle de personal',
                role: [1,2]
            },

            edit: {
                href: `${endpoint}/edit/[id]`,
                label: 'Editar personal',
                role: [1,2]
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