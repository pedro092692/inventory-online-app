import Barchart from '@/app/(store)/store/reports/_components/charts/barchart/barchart'
import ChartSection from '../charts/sectionChart' 
import { Users, Repeat2, Package, Phone, Calendar, Trophy,  ThumbsDown} from 'lucide-react'

export default function WorstProductsReport({ worstProducts = [] }) {
  
    return (
        <ChartSection title="Productos menos vendidos" subtitle="Unidades vendidas — pasa el mouse para ver ingresos" icon={ThumbsDown}>
            <Barchart data={worstProducts} keys={['name', 'value']} type={'product'}/>
        </ChartSection>
    )    

}