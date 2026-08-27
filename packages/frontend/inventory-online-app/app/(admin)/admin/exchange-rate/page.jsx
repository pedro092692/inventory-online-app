import { Container } from '@/app/ui/utils/container'
import { Button } from '@/app/ui/utils/button/buttons'
import Link from 'next/link'
import { Suspense } from 'react'
import ListSkeleton from '@/app/ui/skeleton/list/listSkeleton'
import CurrentRateCard from '@/app/(admin)/admin/exchange-rate/_components/currentRateCard'
import ExchangeRateHistory from '@/app/(admin)/admin/exchange-rate/_components/exchangeRateHistory'

export default async function ExchangeRate({searchParams}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1

    return (
        <Container
            direction='column'
            alignItem='start'
            padding='0px'
            width='100%'
            gap='16px'
        >
            <CurrentRateCard/>

            <Link href={'/admin/exchange-rate/add'}>
                <Button showIcon={true} type={'secondary'} icon='circlePlus' children='Registrar nueva tasa'
                    className='p3-r shadow'/>
            </Link>

            <Suspense key={currentPage} fallback={<ListSkeleton nTitle={3}/>}>
                <ExchangeRateHistory page={currentPage}/>
            </Suspense>
        </Container>
    )
}
