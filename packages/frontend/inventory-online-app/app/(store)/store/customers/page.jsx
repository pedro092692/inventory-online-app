import Link from "next/link"

export default function Customer({children}) {
    return (
       // add new customer 
       <Link href="/store/customers/add">Agregar nuevo cliente</Link>
    )
}