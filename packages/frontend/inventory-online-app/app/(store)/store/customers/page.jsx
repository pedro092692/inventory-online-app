import Link from "next/link"
import ViewCustomers from "@/app/ui/customers/all/allCustomer"
import { Container } from "@/app/ui/utils/container"

export default function Customer({children}) {
    return (
       <Container
        direction={'column'}
        alignItem={'start'}
        padding='0px'
        width='100%'
       >
            {/* // add new customer  */}
            <Link href="/store/customers/add">Agregar nuevo cliente</Link>
            {/* view all customers */}
            <ViewCustomers />
       </Container>
       
    )
}