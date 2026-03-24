import styles from './list.module.css'
import Actions from '@/app/ui/actions/actions'

export default function List({
        tableHead=[], 
        tableData=[], 
        userPermissions=[],
        endpoint='',
        deleteKey = '',
        showActions=false, 
        CustomStyles={},
        customClass='',
        showView=true,
        showEdit=true,
        showDelete=true,
        queryString=''

    }) {
    return (
        <div className={`${styles.container} shadow-sm ${customClass}`} style={CustomStyles}>
            <table className={`${styles.table} p3-b`}>
                <thead>
                    <tr>
                        {Object.keys(tableHead).map((key, index) => {
                            if (showActions === false && key === 'actions') {
                                return null
                            }
                            
                            return (
                                <th key={index} scope="col">{tableHead[key]}</th>
                            )
                            
                        })}
                    </tr>
                </thead>
                <tbody>
                   {
                        tableData.map((data, index) => {
                            return (
                                <tr key={index}>
                                    {
                                        Object.keys(data).map((key, idx) => {
                                            if (key !== 'id') {
                                                return (
                                                    <td key={idx} data-label={key} 
                                                        style={key === 'name' ? { textTransform: 'capitalize' } : {}}>
                                                        {data[key]} 
                                                    </td>
                                                )
                                            }
                                            
                                            if (key === 'id' && showActions) {
                                                return (
                                                    <td key={idx} data-label={'actions'}>
                                                        <Actions
                                                            userPermissions={userPermissions}
                                                            endpoint={endpoint}
                                                            resourceId={data[key]}
                                                            deleteKey={deleteKey}
                                                            showView={showView}
                                                            showEdit={showEdit}
                                                            showDelete={showDelete}
                                                        />
                                                    </td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })
                   }
                   
                </tbody>
            </table>
        </div>
    )
}
