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
                        tableData.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex}>
                                    <td>{row.name}</td>
                                    <td>{row.id_number}</td>
                                    <td>{row.phone}</td>
                                    <td>
                                        {/* user detail */}
                                        <Link href={`/store/customers/view/detail/${row.id}?page=${page}`}>Ver</Link>
                                    </td>
                                </tr>
                            )
                        }) 
                   }
                   
                </tbody>
            </table>
        </div>
    )
}
