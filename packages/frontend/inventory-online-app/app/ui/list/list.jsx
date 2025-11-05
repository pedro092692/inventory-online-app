import styles from './list.module.css'

export default function List({tableHead=[], tableData=[]}) {
    return (
        <div className={`${styles.container} shadow`}>
            <table className={styles.table}>
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
                                <td key={idx} className={parseFloat(item) ? styles.number : ''}>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
