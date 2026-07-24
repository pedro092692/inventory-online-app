import {Container} from '@/app/ui/utils/container'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import TopProducts from '@/app/(store)/store/reports/_components/products/topProductsData'


export default function Reports() {
    return (
        <Container
            padding={'16px 0 0 0'}
            direction={'column'}
            width={'100%'}
            gap={'16px'}
        >   
             <Suspense key={'kpi'} fallback={<FormSkeleton nFields={1}/>} >
                {/* <CustomerKPI /> */}
                </Suspense>
            
            <Suspense key={'charts'} fallback={<FormSkeleton nFields={1}/>} >
                <Container
                    padding={'16px'}
                    width={'100%'}
                    gap={'24px'}
                >
                    <TopProducts />
                </Container>
            </Suspense>
        </Container>
    
    )
}