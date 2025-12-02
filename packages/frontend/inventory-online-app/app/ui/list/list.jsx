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
                    {tableData.map((data, index) => (
                        <tr key={index}>
                            {data.map((item, idx) => {
                                if (idx != 3) {
                                    return (
                                        <td key={idx} className={parseFloat(item) ? styles.number : styles.capitalize}>{item}</td>
                                    )
                                    }
                                }
                            )}
                            <td style={{textAlign: 'center'}}>
                                {/* {avalibleActions} */}
                                <Link href={`/store/customers/view/detail/${data[3]}`} className="link">
                                    ver
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
