import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../../utils/icons/icons'
import Link from 'next/link'
import styles from './panel.module.css'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import LogoutAction from '@/app/lib/actions/logout'


export async function Panel({type = 'store'}) {
    const userInfo = await getCurrentUser()
    const menuStore = {
        customers: {
            title: 'Clientes',
            icon: 'customer',
            link: '/store/customers',
            role: [1,2,3,4]
        },

        products: {
            title: 'Productos',
            icon: 'product',
            link: '/store/products',
            role: [1,2,3,4]

        },

        bills: {
            title: 'Oderdenes de compra',
            icon: 'paper',
            link: '/store/bills',
            role: [1,2,3,4]
        },

        cashier: {
            title: 'Personal',
            icon: 'cashier',
            link: '/store/staff',
            role: [1,2,3]
        },

        paymentMethods: {
            title: 'Metodos de pago',
            icon: 'creditCard',
            link: '/store/payment-methods',
            role: [1,2,3]

        },

        dollar: {
            title: 'Precio del dolar',
            icon: 'dollar',
            link: '/store/currency',
            role: [1,2,3]
        },

        reports: {
            title: 'Reportes',
            icon: 'report',
            link: '/store/reports',
            role: [1,2,3]
        },

        sell: {
            title: 'Vender',
            icon: 'sell',
            link: '/store/sell',
            role: [1,2,3,4]
        },

        quote: {
            title: 'Cotizar',
            icon: 'paper',
            link: '/store/quote',
            role: [1,2,3,4]
        },

        labels: {
            title: 'Etiquetas',
            icon: 'pdf',
            link: '/store/labels',
            role: [1,2,3]
        },

        subscription: {
            title: 'Mi tienda',
            icon: 'store',
            link: '/store/subscription',
            role: [2]
        }
    }

    const adminMenu = {
        users: {
            title: 'Tiendas',
            icon: 'store',
            link: '/admin/users',
            role: [1]
        },

        payments: {
            title: 'Pagos',
            icon: 'cash',
            link: '/admin/payments',
            role: [1]
        },

        exchangeRate: {
            title: 'Tasa de cambio',
            icon: 'dollar',
            link: '/admin/exchange-rate',
            role: [1]
        }
    }

    const menu = (type) => {
        return type === 'store' ? menuStore : adminMenu
    }

    return(
        <Container className={styles.panel}>
            {/* logo */}
            <Link href={`${type === 'store' ? '/store' : '/admin'}`}>
                <Logo type='logoWhite' style={{width: '100%'}}/>
            </Link>
            {/* menu container */}
            <Container className={styles.menu}>
                {/* render menu */}
                
                {Object.keys(menu(type)).map(((key, index) => {
                    if (menu(type)[key].role.includes(userInfo.role)) {
                        return (
                            <Link key={index} href={menu(type)[key].link} style={{width: '100%'}}>
                                <Container
                                    className={`p2-r ${styles.menuItem}`}
                                >
                                    <p>{menu(type)[key].title}</p>
                                    <Icon icon={menu(type)[key].icon}/>
                                </Container>
                            </Link>
                        )
                    }
                }))}
            </Container>
            {/* logout */}
            <form action={LogoutAction} style={{width: '100%'}}>
                <button
                    type="submit"
                    className={`p2-r ${styles.menuItem} ${styles.logoutButton}`}
                >
                    <p>Cerrar sesión</p>
                    <Icon icon='logout'/>
                </button>
            </form>
        </Container>
    )
}