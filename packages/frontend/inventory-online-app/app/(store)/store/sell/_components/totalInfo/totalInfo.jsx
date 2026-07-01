import styles from './totalInfo.module.css'

export default function totaInfo({total={total_usd: 0, total_bs: 0}, totalPaidUSD=0, exchangeRate=1, remainingToPayUSD=0, changeDueUSD=0}) {
    return (
        <div className={`${styles.infoContainer} shadow-bottom-sm`}>
            <div className={`${styles.payInfo} shadow`}>
                <h2 className={styles.title}>Total A Pagar:</h2>
                <p className={styles.total}>
                    {new Intl.NumberFormat('en-US').format(total?.total_usd.toFixed(2) || 0)} $
                </p>
                <div className='divider'></div>
                <p className={styles.total}>
                    {new Intl.NumberFormat('es-VE').format(total?.total_bs.toFixed(2) || 0)} Bs
                </p>
            </div>

             {
                totalPaidUSD !=0 && remainingToPayUSD > 0.01 && (
                    <div className={`${styles.payInfo} shadow`}>
                        <h2 className={styles.title}>Por Pagar:</h2>
                        <p className={styles.totalToPaid}>
                            {new Intl.NumberFormat('en-US').format(remainingToPayUSD.toFixed(2) || 0)} $ 
                        </p>
                        <div className='divider'></div>
                        <p className={styles.totalToPaid}>
                            {new Intl.NumberFormat('en-US').format((remainingToPayUSD * exchangeRate).toFixed(2))} Bs
                        </p>
                    </div>
                )
            }
            
            {
                totalPaidUSD > 0 && (
                    <div className={`${styles.payInfo} shadow`}>
                        <h2 className={styles.title}>Total Abonado:</h2>
                        <p className={styles.totalPaid}>
                            {new Intl.NumberFormat('en-US').format(totalPaidUSD.toFixed(2) || 0)} $ 
                        </p>
                        <div className='divider'></div>
                        <p className={styles.totalPaid}>
                            {new Intl.NumberFormat('en-US').format((totalPaidUSD * exchangeRate || 0).toFixed(2))} Bs
                        </p>
                    </div>
                )
            }
            
            {
                changeDueUSD > 0 && (
                    <div className={`${styles.payInfo} shadow`}>
                        <h2 className={styles.title}>Cambio (Vuelto):</h2>
                        <p className={styles.totalPaidChange}>
                            {new Intl.NumberFormat('en-US').format(changeDueUSD.toFixed(2) || 0)} $ 
                        </p>
                        <div className='divider'></div>
                        <p className={styles.totalPaidChange}>
                            {new Intl.NumberFormat('en-US').format((changeDueUSD * exchangeRate || 0).toFixed(2))} Bs
                        </p>
                    </div>
                )
            }
        </div>
    )
}