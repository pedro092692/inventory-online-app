import GetItemAction from '@/app/lib/actions/get'
import ChartSection from '../charts/sectionChart' 
import BesWorstChart from '@/app/(store)/store/reports/_components/charts/barchart/bestWorstChart'
import { ArrowUpDown } from 'lucide-react'


export default async function DetailsSales() {
    // await new Promise (r => setTimeout(r, 1000))
    const url = `reports/detail-sales`
    const response = await GetItemAction(url, 'Hubo un error inesperado intenta nuevamente')
    const {data, error} = response
    const rawData = data 
    const payments = ['Punto de venta', 
                      'Pago Movil', 
                      'Transferencia', 
                      'Efectivo Bolivares', 
                      'Efectivo Dolares', 
                      'Transferencia Dolares',
                      'Cripto',
                      'Biopago',
                      'Nota de Credito'
                    ]
    
    const mapTotalTransactions = (data, type = 'transactions') => {
        return data.reduce((acc, d) => acc + (type === 'total' ? parseFloat(d.total_dollar) : parseInt(d.transactions)) , 0)
    }

    const payment_total_transactions = (data, payment_id, total, type = 'transactions') => {
        const n_transactions =  data.reduce((acc, d) => {
            if (d.payment === payments[payment_id]) {
                return acc + parseInt(type == 'total' ? d.total_dollar : d.transactions)
            }
                return acc
        }, 0)
        const ptc = ((n_transactions / total) * 100).toFixed(2)
        return {
            name: payments[payment_id],
            value: n_transactions,
            ptc: ptc
        }

    }

    const total_transactions = mapTotalTransactions(rawData, 'transactions')
    const total_revenue = mapTotalTransactions(rawData, 'total')
    const total_payment_data_info = payments
        .map((name, index) => payment_total_transactions(rawData, index, total_transactions, 'transactions'))
        .filter(item => item.value > 0)
    
    const total_revenue_payment_data_info = payments
        .map((name, index) => payment_total_transactions(rawData, index, total_revenue, 'total'))
        .filter(item => item.value > 0)
    
    console.log(total_revenue_payment_data_info, total_payment_data_info)
   
    return (
        <ChartSection title="Mejores y peores días del periodo" subtitle="Top 5 mejores en verde, top 5 peores en rojo"  icon={ArrowUpDown}>
            :p
        </ChartSection> 
    ) 
}