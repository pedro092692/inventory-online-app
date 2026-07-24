import Barchart from '@/app/(store)/store/reports/_components/charts/barchart/barchart'
import ChartSection from '../charts/sectionChart' 
import { Users, Repeat2, Package, Phone, Calendar, Trophy,  ThumbsDown} from 'lucide-react'

export default function TopProductsReport({ topProducts = [] }) {
  
    return (
        <ChartSection title="Productos más vendidos" subtitle="Unidades vendidas — pasa el mouse para ver ingresos" icon={Package}>
            <Barchart data={topProducts} keys={['name', 'value']} type={'product'}/>
        </ChartSection>
    )    

}