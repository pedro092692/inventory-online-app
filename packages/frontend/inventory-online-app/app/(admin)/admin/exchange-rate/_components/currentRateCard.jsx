import Request from '@/app/utils/request'
import KpiCard from '@/app/(store)/store/reports/_components/kpiCards/kpiCards'
import { DollarSign } from 'lucide-react'
import { Container } from '@/app/ui/utils/container'

export default async function CurrentRateCard() {
    const response = await Request('exchange-rate/latest', 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const rate = data?.rate || null

    return (
        <Container padding='0px' width='100%' justifyContent='flex-start' gap='32px'>
            {
                rate ? (
                    <KpiCard
                        label={'Tasa de cambio actual'}
                        value={`Bs. ${rate.value} por USD`}
                        icon={DollarSign}
                        text='md'
                        textColor='green-700'
                        mainTextSize='md'
                        extraText={`Actualizada: ${new Date(rate.date).toLocaleDateString('es-VE')}`}
                    />
                ) : (
                    <KpiCard
                        label={'Tasa de cambio actual'}
                        value={'Sin registrar'}
                        icon={DollarSign}
                        text='md'
                        textColor='red-700'
                        mainTextSize='md'
                        extraText={'Registra una tasa para poder cobrar suscripciones'}
                    />
                )
            }
        </Container>
    )
}
