import GetItemAction from '@/app/lib/actions/get'
import { Container } from '@/app/ui/utils/container'
import CustomerInfo from '@/app/(store)/store/bills/_components/detail/customerDetail/customerDetail'
import BillStatusDetail from '@/app/(store)/store/bills/_components/detail/status/status'
import PaymentDetails from '@/app/(store)/store/bills/_components/detail/paymentDetail/paymentDetail'
import ProductDetails from '@/app/(store)/store/bills/_components/detail/productDetail/productDetail'
import InvoicePDF from '@/app/(store)/store/bills/_components/pdf/pdf'
import InvoiceBasicInfo from '@/app/(store)/store/bills/_components/detail/basicInfo/basicInfo'
import { Button } from '@/app/ui/utils/button/buttons'
import { Icon } from '@/app/ui/utils/icons/icons'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import Pagination from '@/app/ui/pagination/pagination'
import Link from 'next/link'

export default async function ReturnedInvoiceProducts({ id, queryString='', limit = 8, page = 1, totalProductPages = 0 }) {
    const endpoint = `invoices/${id}`
    const params = new URLSearchParams()
    params.append('limitProducts', limit)
    params.append('pageProducts', page)

    const url = `${endpoint}?${params.toString()}`

    const response = await GetItemAction(url)
    const currentUser = await getCurrentUser()
    const { data, error } = response
    const invoice = data?.invoice || null

    // await new Promise(resolve => setTimeout(resolve, 1000))
    return (
        <p>Invoice returned products....</p>
    )
}
