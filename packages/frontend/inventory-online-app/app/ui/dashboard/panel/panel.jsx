import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import { Icon } from '../../utils/icons/icons'
import Link from 'next/link'
import styles from './panel.module.css'


export function Panel() {
    const menuItems = {
        customers: {
            title: 'clientes',
            icon: 'customer',
            link: '/store/customers'
        },

        products: {
            title: 'productos',
            icon: 'product',
            link: '/store/products'

        },

        bills: {
            title: 'Oderdenes de compra',
            icon: 'paper',
            link: '/store/bills'
        },

        cashier: {
            title: 'Cajeros',
            icon: 'cashier',
            link: '/store/cashiers'
        },

        paymentMethods: {
            title: 'Metodos de pago',
            icon: 'creditCard',
            link: '/store/payment-methods'

        },

        dollar: {
            title: 'Precio del dolar',
            icon: 'dollar',
            link: '/store/currency'
        },

        reports: {
            title: 'Reportes',
            icon: 'report',
            link: '/store/reports'
        },

        sell: {
            title: 'Vender',
            icon: 'sell',
            link: '#'
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
                }))}
            </Container>
        </Container>
    )
}