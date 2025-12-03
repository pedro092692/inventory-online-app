import styles from './list.module.css'
import Link from 'next/link'

export default function List({tableHead=[], tableData=[], actions}) {
    const getActions = (actions) => {
        const options = {
            1: 'Ver',
            2: 'Ver | Editar',
            3: 'Ver | Editar | Eliminar'
        }
        return options[actions.length - 1] || 'Ver'
    }
    const avalibleActions = getActions(actions)

    return (
        <div className={`${styles.container} shadow-sm`}>
            <table className={`${styles.table} p3-b`}>
                <thead>
                    <tr>
                        {tableHead.map((head, index) => (
                            <th key={index}>{head}</th>
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
                                        <Link href={`/store/customers/view/detail/${row.id}`}>Ver</Link>
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
