
export default function totaInfo({total={total_usd: 0, total_bs: 0}, totalPaidUSD=0, exchangeRate=1, remainingToPayUSD=0, changeDueUSD=0}) {
    return (
        <div>
            <p>Total Factura: {total?.total_usd.toFixed(2) || 0} $ / {total?.total_bs.toFixed(2) || 0} Bs</p>
            {totalPaidUSD > 0 && (
                <p>Total Abonado: {totalPaidUSD.toFixed(2) || 0} $ / {(totalPaidUSD * exchangeRate || 0).toFixed(2)} Bs</p>
            )}
            
            <p>Resta por pagar: {remainingToPayUSD.toFixed(2)} $ /
                {(remainingToPayUSD * exchangeRate).toFixed(2)} Bs
            </p>
            {
                changeDueUSD > 0 && (
                    <p style={{color: 'green', fontWeight: 'bold'}}> 
                        Cambio (Vuelto): {changeDueUSD.toFixed(2) || 0} $ / 
                        {(changeDueUSD * exchangeRate || 0).toFixed(2)} Bs
                    </p>
                )
            }
        </div>
    )
}