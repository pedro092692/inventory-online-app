import SalesPeakHourPatterns from '@/app/(store)/store/reports/_components/sales/pearkHoursData'
import BestDayofWeekPattern from '@/app/(store)/store/reports/_components/sales/peakDaysWeekData'
import BestWorstDays from '@/app/(store)/store/reports/_components/sales/bestAndWortsDayData'
import {Container} from '@/app/ui/utils/container'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import styles from './patterns.module.css'


export default async function SalesPatterns() {
  
    return (
        <Container
            padding={'0px'}
            width={'100%'}
            direction={'column'}
            gap={'24px'}
        >
            <Container
                padding={'0px'}
                width={'100%'}
                className={styles.chartContainer}
            >
                
                <Suspense key={'SalesPeakHours'} fallback={<FormSkeleton nFields={1}/>} >
                    <SalesPeakHourPatterns />
                </Suspense>

                <Suspense key={'bestDayOfWeek'} fallback={<FormSkeleton nFields={1}/>} >
                    <BestDayofWeekPattern />
                </Suspense>
            </Container>
            <Suspense key={'bestDayOfWeek'} fallback={<FormSkeleton nFields={1}/>} >
                <BestWorstDays />
            </Suspense>
        </Container>
    )
  
}