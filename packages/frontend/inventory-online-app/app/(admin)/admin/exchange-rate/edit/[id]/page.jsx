import ExchangeRateInfo from '@/app/(admin)/admin/exchange-rate/_components/edit/detail'
import FormSkeleton from '@/app/ui/skeleton/form/formSkeleton'
import { Suspense } from 'react'

export default async function EditExchangeRate({ params }) {
    const { id } = await params

    return (
        <>
            <h1 className='h3'>Editar tasa de cambio</h1>
            <Suspense key={id} fallback={<FormSkeleton nFields={2}/>}>
                <ExchangeRateInfo id={id}/>
            </Suspense>
        </>
    )
}
