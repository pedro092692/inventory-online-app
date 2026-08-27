import Request from '@/app/utils/request'
import List from '@/app/ui/list/list'
import Pagination from '@/app/ui/pagination/pagination'

const LIMIT = 10

export default async function ExchangeRateHistory({page = 1}) {
    const response = await Request(`exchange-rate?limit=${LIMIT}&page=${page}`, 'GET', null, 'Hubo un error inesperado intenta nuevamente')
    const { data, error } = response

    if (error) {
        return <p className='p2-r errorMsg'>{error}</p>
    }

    const rates = data?.rates || []
    const totalPages = data?.totalPages || 1

    if (rates.length === 0) {
        return <p className='p2-r'>Aún no se ha registrado ninguna tasa de cambio.</p>
    }

    // `id` must be the LAST key — <List/> renders the Actions cell in the "id" slot's
    // position, and the header always lists "actions" last.
    const tableData = rates.map((rate) => ({
        date: new Date(rate.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        value: new Intl.NumberFormat('es-VE').format(rate.value),
        id: rate.id
    }))

    return (
        <>
            <List
                tableHead={{
                    date: 'Fecha',
                    value: 'Valor (Bs. por USD)',
                    actions: 'Acciones'
                }}
                tableData={tableData}
                showActions={true}
                showView={false}
                endpoint='exchange-rate'
                deleteKey='id'
                deleteMsg='Tasa de cambio eliminada con éxito'
                userPermissions={['update', 'delete']}
                typeList={'admin'}
            />
            {totalPages > 1 && <Pagination totalPages={totalPages}/>}
        </>
    )
}
