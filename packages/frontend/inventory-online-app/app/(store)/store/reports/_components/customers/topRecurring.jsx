import Barchart from '@/app/(store)/store/reports/_components/charts/barchart/barchart'
import ChartSection from '../charts/sectionChart' 
import { Users, Repeat2, Package, Phone, Calendar, Trophy } from 'lucide-react'

export default function TopRecurringReport({ topRecurring = [] }) {
  
    return (
        <ChartSection title="Clientes más recurrentes" subtitle="Número de compras registradas pro cliente" icon={Repeat2}>
            <Barchart data={topRecurring} keys={['name', 'value']} type={'recurring'}/>
        </ChartSection>
    )    

}