export default function Payments({payments=[], removePayment=()=>''}) {
    return (
        <div>
            <h4>Pagos Registrados:</h4>
            {payments.length > 0 ? (
                payments.map((payment, index) => (
                    <p key={index}>
                        • {payment.name}: {payment.amount} {payment.currency}
                        {payment.currency === 'Bolivar Digital' && ` (~${payment.amountInUSD.toFixed(2)} $)`}
                        <span onClick={() => removePayment(index)}>🗑️</span>
                    </p>
                    
                ))
            ) : 
            <p>No hay pagos agregados aun.</p>}
        </div>
    )
}