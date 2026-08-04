import GetItemAction from '@/app/lib/actions/get'
import {Container} from '@/app/ui/utils/container'

const METHOD_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]

export default async function ClosureSalesData({seller_id = null, date = null}) {
    // await new Promise (r => setTimeout(r, 1000))
  
    const cash_closing_url = `reports/cash-closing?${seller_id ? `sellerId=${seller_id}&` : ''}${date ? `date=${date}` : ''}`
    const cash_balance_url = `reports/cash-balance?${seller_id ? `sellerId=${seller_id}&` : ''}${date ? `date=${date}` : ''}`
  

    const [closing_response, balance_response] = await Promise.all([
        GetItemAction(cash_closing_url, 'Hubo un error inesperado intenta nuevamente'),
        GetItemAction(cash_balance_url, 'Hubo un error inesperado intenta nuevamente')
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

    console.log('closingData', closingData)
    console.log('balanceData', balanceData)
    return (
        <Container>
            Hola cierre
        </Container>
    )


}