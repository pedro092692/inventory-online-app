import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../../utils/icons/icons'
import Link from 'next/link'
import styles from './panel.module.css'
import { getCurrentUser } from '@/app/utils/getCurrentUser'


export async function Panel() {
    const userInfo = await getCurrentUser()
    const menuItems = {
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
            title: 'Cajeros',
            icon: 'cashier',
            link: '/store/cashiers',
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
        }
    }

    return(
        <Container className={styles.panel}>
            {/* logo */}
            <Link href='/store'>
                <Logo type='logoWhite' style={{width: '100%'}}/>
            </Link>
            {/* menu container */}
            <Container className={styles.menu}>
                {/* render menu */}
                {Object.keys(menuItems).map(((key, index) => {
                    if (menuItems[key].role.includes(userInfo.role)) {
                        return (
                            <Link key={index} href={menuItems[key].link} style={{width: '100%'}}>
                                <Container
                                    className={`p2-r ${styles.menuItem}`}
                                >
                                    <p>{menuItems[key].title}</p>
                                    <Icon icon={menuItems[key].icon}/>
                                </Container>
                            </Link>
                        )
                    }
                }))}
            </Container>
        </Container>
    )
}