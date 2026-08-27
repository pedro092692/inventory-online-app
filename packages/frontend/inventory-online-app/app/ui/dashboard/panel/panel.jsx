import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../../utils/icons/icons'
import Link from 'next/link'
import styles from './panel.module.css'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import GetItemAction from '@/app/lib/actions/get'


export async function Panel({type = 'store'}) {
    const userInfo = await getCurrentUser()
    const { data: storeOverview } = type === 'store' ? await GetItemAction('store/me') : { data: null }
    const storeName = storeOverview?.store?.name
    const menuStore = {
        customers: {
            title: 'clientes',
            icon: 'customer',
            link: '/store/customers',
            role: [1,2,3,4]
        },

        products: {
            title: 'productos',
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
            {/* store name */}
            {storeName && <p className={`p2-b ${styles.storeName}`}>{storeName}</p>}
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
        </Container>
    )
}