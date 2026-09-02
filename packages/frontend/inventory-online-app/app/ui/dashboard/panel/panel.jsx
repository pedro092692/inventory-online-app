import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { PanelNav } from './panelNav'

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
            role: [1,2]
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

    const menu = type === 'store' ? menuStore : adminMenu

    const items = Object.values(menu).filter((item) => item.role.includes(userInfo.role))

    return <PanelNav items={items} type={type} />
}
