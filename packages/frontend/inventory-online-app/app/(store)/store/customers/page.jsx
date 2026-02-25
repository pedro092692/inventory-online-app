import Link from "next/link"
import ViewCustomers from "@/app/ui/customers/all/allCustomer"


export default function Customer({children}) {
    return (
       <>
            {/* // add new customer  */}
            <Link href="/store/customers/add">Agregar nuevo cliente</Link>
            <ViewCustomers />
       </>
       
    )
}