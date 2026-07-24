import Barchart from '@/app/(store)/store/reports/_components/charts/barchart/barchart'
import ChartSection from '../charts/sectionChart' 
import { Users, Repeat2, Package, Phone, Calendar, Trophy } from 'lucide-react'

export default function TopSpendersReport({ topSpenders = [] }) {
    // 1. set data to chart
    const chartData = topSpenders.map(({id, name, total_spent, first_purchase, last_purchase, phone}) => {
        return {
            id,
            name,
            total_spent: parseFloat(total_spent),
            first_purchase,
            last_purchase,
            phone
            
        }
    })

    return (
        <ChartSection title="Top clientes por gasto" subtitle="Ranking por total invertido en la tienda" icon={Trophy}>
            <Barchart data={chartData} keys={['name', 'total_spent']} type={'spending'}/>
        </ChartSection>
    )    

}