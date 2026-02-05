import styles from './list.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Actions from '@/app/ui/actions/actions'


export default function List({tableHead=[], tableData=[], role=null, showActions=true, CustomStyles, currentUser={permissions: []}}) {
    const page = useSearchParams().get('page') || 1
    const search = useSearchParams().get('search') || ''

    const getActions = (role) => {
        const options = {
            USER: 'Ver',
            OWNER: 'Ver | Editar',
            ADMIN: 'Ver | Editar | Eliminar'
        }
        return options[role] || 'Ver'
    }
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
                                                    <td key={idx} data-label={key}>
                                                        {data[key]}
                                                    </td>
                                                )
                                            }
                                            
                                            if (key === 'id' && showActions) {
                                                return (
                                                    <td key={idx} data-label={'actions'}>
                                                        {/* <Link href={`/store/customers/view/detail/${data[key]}?page=${page}${search ? `&search=${search}` : ''}`}>
                                                            {getActions(role)}
                                                        </Link> */}
                                                        <Actions 
                                                            currentUser={currentUser}
                                                            urlPath={'customers'}
                                                            id={data[key]}
                                                            params={`?page=${page}${search ? `&search=${search}` : ''}`}
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
