export default async function Customers2({ customers }){
    return (
        <ul>
            {
                customers &&
                customers.map(customer => (
                    <li key={customer.id}>
                        {customer.name}
                    </li>
                ))
            }
        </ul>
    )
}