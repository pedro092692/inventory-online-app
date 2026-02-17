import styles from './list.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Actions from '@/app/ui/actions/actions'


export default function List({
        tableHead=[], 
        tableData=[], 
        showActions=true, 
        CustomStyles, 
        userPermission={permissions: []},
        deletionID='id',
        setTableData=null
    }) {
    const page = useSearchParams().get('page') || 1
    const search = useSearchParams().get('search') || ''

    return (
        <div className={`${styles.container} shadow-sm`} style={CustomStyles}>
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
                                                    <td key={idx} data-label={key} style={key === 'name' ? { textTransform: 'capitalize' } : {}}>
                                                        {data[key]} 
                                                    </td>
                                                )
                                            }
                                            
                                            if (key === 'id' && showActions) {
                                                return (
                                                    <td key={idx} data-label={'actions'}>
                                                        <Actions 
                                                            userPermission={userPermission}
                                                            urlPath={'customers'}
                                                            id={data[key]}
                                                            params={`?page=${page}${search ? `&search=${search}` : ''}`}
                                                            deletionID={deletionID}
                                                            setTableData={setTableData}
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
