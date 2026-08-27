import { Container } from '@/app/ui/utils/container'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import StoreOverview from '@/app/(store)/store/subscription/_components/storeOverview'
import PaymentForm from '@/app/(store)/store/subscription/_components/paymentForm'
import PaymentHistory from '@/app/(store)/store/subscription/_components/paymentHistory'

export default async function Subscription() {
    const userInfo = await getCurrentUser()

    if (userInfo?.role !== 2) {
        return (
            <Container
                direction='column'
                alignItem='start'
                padding='0px'
                width='100%'
            >
                <p className='p2-r'>Solo el dueño de la tienda puede gestionar la suscripción.</p>
            </Container>
        )
    }

    return (
        <Container
            direction='column'
            alignItem='start'
            padding='0px'
            width='100%'
            gap='16px'
        >
            <Suspense fallback={<FormSkeleton nFields={5}/>}>
                <StoreOverview />
            </Suspense>

            <PaymentForm />

            <Suspense fallback={<FormSkeleton nFields={3}/>}>
                <PaymentHistory />
            </Suspense>
        </Container>
    )
}
