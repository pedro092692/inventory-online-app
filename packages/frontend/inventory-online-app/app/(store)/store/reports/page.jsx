
import TopSpenders from './_components/customers/topSpenderData'
import {Container} from '@/app/ui/utils/container'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import TopRecurring from '@/app/(store)/store/reports/_components/customers/topRecurringData'

export default function Reports() {
    return (
        
        <Suspense fallback={<FormSkeleton nFields={1}/>} >
            <Container
                padding={'16px'}
                width={'100%'}
                gap={'24px'}
            >
                <TopSpenders />
                <TopRecurring />
            </Container>
        </Suspense>
    
    )
}