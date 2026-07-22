import GetItemAction from '@/app/lib/actions/get'
import List from '@/app/ui/list/list'
import { Button } from '@/app/ui/utils/button/buttons'
import togglePaymentMethodAction from '@/app/lib/actions/togglePaymentMethodAction'
import styles from '@/app/(store)/store/currency/_components/data.module.css'

export default async function PyamentsInfo({}){
    const enpoint = 'payment-methods/all'
    const params = new URLSearchParams()
    const rawParams = params.toString()

    params.append('forListing', true)
 

    const url = `${enpoint}?${params.toString()}`


    
    const response = await GetItemAction(url)
    
    const {data, error} = response
    const rawData = data?.paymentMethods || []
    const userPermissions = data?.permissions || []
    

    const paymentsData = rawData.map(data => {
        return {
            name: data.name,
            currency: data.currency,
            status: data.status == 'ACTIVE' ? 'Activo' : 'Desactivado',
            id: data.id
        }
    })
    
    const tableHead = {
        date: 'Nombre',
        value: 'Moneda',
        staus: 'Estatus',
        actions: 'Acciones'
    }
    
    if (error) {
        return (
            <div>
                <p className='p2-r errorMsg'>{error}</p>
            </div>
        )
    }

    const customButton = (data) => {
       const isActive = data.status == 'Activo' ? true : false

       return (
            <form action={togglePaymentMethodAction} style={{ display: 'inline-block' }}>
                <input type="hidden" name="id" value={data.id} />
                <input type="hidden" name="status" value={isActive ? 'true' : 'false'} />
                <Button
                    role="submit"
                    style={{
                    backgroundColor: isActive ? 'var(--color-accentRed400, #e53e3e)' : 'var(--color-accentGreen400, #38a169)',
                    color: '#fff',
                    padding: '6px 12px',
                    fontSize: '0.85rem'}}
                    >
                    {isActive ? ' Desactivar' : ' Activar'}
                </Button>
            </form>
       )
    }

    return (
        <List
            tableHead={tableHead}
            tableData={paymentsData}
            showActions={true}
            params={rawParams}
            endpoint='dollar-value'
            userPermissions={userPermissions}
            showView={false}
            showDelete={false}
            showEdit={false}
            custonActionButton={(data) => customButton(data)}
            customClass={styles.table}
        />
    )
}