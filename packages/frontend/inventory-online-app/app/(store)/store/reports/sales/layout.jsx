import {Container} from '@/app/ui/utils/container'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import SaleKPI from '@/app/(store)/store/reports/_components/sales/kpi'

export default function SalesLayout({children}) {
    return (
        <>
            <Container
                padding={'16px 0 0 0'}
                direction={'column'}
                width={'100%'}
                gap={'16px'}
            > 
                <Suspense key={'kpi'} fallback={<FormSkeleton nFields={1}/>} >
                                <SaleKPI />
                </Suspense>
                
                {children}
            
            </Container>
        </>
    )
}