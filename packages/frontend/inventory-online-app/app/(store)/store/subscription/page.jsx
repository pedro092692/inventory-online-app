import { Container } from '@/app/ui/utils/container'
import { getCurrentUser } from '@/app/utils/getCurrentUser'
import { Suspense } from 'react'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import StoreOverview from '@/app/(store)/store/subscription/_components/storeOverview'
import PaymentForm from '@/app/(store)/store/subscription/_components/paymentForm'
import PaymentHistory from '@/app/(store)/store/subscription/_components/paymentHistory'

export default async function Subscription({searchParams}) {
    const userInfo = await getCurrentUser()
    const params = await searchParams
    const currentPage = Number(params?.page) || 1

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
            <h2 className='h3'>Salud de tienda</h2>
            <Suspense fallback={<FormSkeleton nFields={5}/>}>
                <StoreOverview />
            </Suspense>

            <Container
                padding={'0px'}
                width={'100%'}
                justifyContent={'start'}
                gap={'24px'}
            >
                <Container
                    padding={'0px'}
                    width={'30%'}
                    height={'100%'}
                    direction={'column'}
                    alignItem={'start'}
                    justifyContent={'start'}
                >
                    <h2 className='h3'>Reportar un pago</h2>
                    <PaymentForm />
                </Container>

                <Container
                    padding={'0px'}
                    width={'70%'}
                    direction={'column'}
                    alignItem={'start'}
                    justifyContent={'start'}
                    height={'100%'}
                >
                    <h2 className='h3'>Historial de pagos</h2>
                    <Suspense key={currentPage} fallback={<FormSkeleton nFields={3}/>}>
                        <PaymentHistory page={currentPage}/>
                    </Suspense>
                </Container>
            </Container>
        </Container>
    )
}
