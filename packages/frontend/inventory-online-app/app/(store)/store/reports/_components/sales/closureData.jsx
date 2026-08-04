import GetItemAction from '@/app/lib/actions/get'
import {Container} from '@/app/ui/utils/container'
import ClosureReport from '@/app/(store)/store/reports/_components/sales/closure/closureReport'

const METHOD_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]

export default async function ClosureSalesData({seller_id, date}) {
    // await new Promise (r => setTimeout(r, 1000))
  
    
    const generateURL = (seller_id, date, type) => {
        const enpoint = type == 'balance'
            ? 'cash-balance'
            : 'cash-closing'
        let url = `reports/${enpoint}`
        if (seller_id && date) return url + `?sellerId=${seller_id}&date=${date}`
        if (seller_id) return url + `?sellerId=${seller_id}`
        if (date) return url + `?date=${date}`
        return url
    } 
  

    const [closing_response, balance_response] = await Promise.all([
        GetItemAction(generateURL(seller_id, date, 'closing'), 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction(generateURL(seller_id, date, 'balance'), 'Hubo un error inesperado intenta nuevamente')
    ])

    const {data: closing_data, error: closing_error} = closing_response
    const {data: balance_data, error: balance_error} = balance_response

    const normalizeClosingData = (raw) => {
        let totalBs = 0
        let totalUsd = 0

        const rows = raw
            .map((r, i) => {
                const currencyLabel = r.payments?.currency ?? ""
                const isUsd = currencyLabel.toLowerCase().includes("dolar")
                const amount = parseFloat(r.total_currenty) || 0

                if (isUsd) totalUsd += amount
                totalBs += amount

                return {
                    name: r.payments?.name ?? "—",
                    currency: currencyLabel,
                    isUsd,
                    amount,
                    transactions: parseInt(r.transactions, 10) || 0,
                    color: METHOD_COLORS[i % METHOD_COLORS.length],
                }
            })
            .sort((a, b) => b.amount - a.amount)
        return { rows, totalBs: Math.round(totalBs * 100) / 100, totalUsd: Math.round(totalUsd * 100) / 100 }
    }


    const normalizeCashBalanceData = (raw) => {
        let netBs = 0
        let netUsd = 0 

        const rows = raw
            .map((r, i) => {
                const currencyLabel = r.payments?.currency ?? ""
                const isUsd = currencyLabel.toLowerCase().includes("dolar")
                const net = parseFloat(r.net_amount) || 0
                const sales = parseFloat(r.total_sales) || 0
                if (isUsd) netUsd += net
                else netBs += net

                return {
                    name: r.payments?.name ?? "-",
                    currency: currencyLabel,
                    isUsd,
                    net,
                    sales,
                    onlyRefunds: sales === 0 && net < 0,
                    movements: parseInt(r.movements, 10) || 0,
                    color: METHOD_COLORS[i % METHOD_COLORS.length],
                }
            })
            .sort((a, b) => b.net - a.net)
        
            return { rows, netBs: Math.round(netBs * 100) / 100, netUsd: Math.round(netUsd * 100) / 100 }
    }

    const closingData = closing_data ? normalizeClosingData(closing_data) : {rows: [], totalBs: 0, totalUsd: 0}
    const balanceData = balance_data ? normalizeCashBalanceData(balance_data) : {rows: [], netBs: 0, netUsd: 0}
    const {rows: rows_closing, totalBs, totalUsd} = closingData
    const {rows: rows_balance, netBs, netUsd} = balanceData
    
    
 
    return (
        <Container>
            <ClosureReport totalBs={totalBs} totalUsd={totalUsd} netBs={netBs} netUsd={netUsd}/>
        </Container>
    )


}