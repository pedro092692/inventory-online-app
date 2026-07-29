import DetailsSales from '@/app/(store)/store/reports/_components/sales/detailsData'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'
import {Container} from '@/app/ui/utils/container'


export default function PatternsReport() {
    return (
         <Suspense key={'charts'} fallback={<FormSkeleton nFields={1}/>} >
            <Container
                padding={'16px'}
                width={'100%'}
                gap={'24px'}
            >   
                <DetailsSales />
            </Container>
        </Suspense>
    )
}