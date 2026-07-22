import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import styles from '@/app/(store)/store/currency/_components/data.module.css'

export default async function Data({ limit = 10, page = 1, queryString = null}){
    const enpoint = 'dollar-value/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()

    params.append('limit', limit)
    params.append('page', page)
 

    const url = `${enpoint}?${params.toString()}`
    
    const response = await GetItemAction(url)
    
    const {data, error} = response
    const rawData = data?.currencyData || []
    const userPermissions = data?.permissions || []

    const historyData = rawData.map(data => {
        return {
            date: new Date(data.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }),
            value: new Intl.NumberFormat('es-VE').format(data.value),
            id: data.id
        }
    })
    
    let tableHead = {
        date: 'Fecha',
        value: 'Valor',
        actions: 'Acciones'
    }
    
    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }

    return (
        <List
            tableHead={tableHead}
            tableData={historyData}
            showActions={true}
            params={rawParams}
            endpoint='dollar-value'
            userPermissions={userPermissions}
            queryString={queryString}
            deleteKey={'id'}
            deleteMsg='Data eliminada con éxito'
            showView={false}
            customClass={styles.table}
        />
    )
}