import styles from './list.module.css'

export default function List({tableHead=[], tableData=[]}) {
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
                            {data.map((item, idx) => (
                                <td key={idx} className={parseFloat(item) ? styles.number : styles.capitalize}>{item}</td>
                            ))}
                            <td style={{textAlign: 'center'}}>
                                ver | editar | eliminar
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
