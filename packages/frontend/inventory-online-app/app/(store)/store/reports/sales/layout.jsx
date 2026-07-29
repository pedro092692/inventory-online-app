import {Container} from '@/app/ui/utils/container'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import SaleKPI from '@/app/(store)/store/reports/_components/sales/kpi'
import SalesNavbar from '@/app/(store)/store/reports/_components/navBar/salesNavBar'


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

                {/* sales navbar container */}
                <Container
                    padding={'0px 24px'}
                    width={'100%'}
                    direction={'column'}
                    gap={'16px'}
                >
                    <SalesNavbar/>
                    <div className='divider'></div>
                </Container>
                
                {children}
            </Container>
        </>
    )
}