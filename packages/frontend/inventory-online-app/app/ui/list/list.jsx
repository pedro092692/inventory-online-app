import styles from './list.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function List({tableHead=[], tableData=[], actions}) {
    const page = useSearchParams().get('page') || 1
    const getActions = (actions) => {
        const options = {
            1: 'Ver',
            2: 'Ver | Editar',
            3: 'Ver | Editar | Eliminar'
        }
        return options[actions.length - 1] || 'Ver'
    }
    console.log('tableData', tableData[0])
    return (
        <div className={`${styles.container} shadow-sm`}>
            <table className={`${styles.table} p3-b`}>
                <thead>
                    <tr>
                        {tableHead.map((head, index) => (
                            <th key={index} scope="col">{head}</th>
                        ))}
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
                                            
                                            if (key === 'id') {
                                                return (
                                                    <td key={idx} data-label={'actions'}>
                                                        <Link href={`/store/customers/view/detail/${data[key]}?page=${page}`}>Ver</Link>
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
