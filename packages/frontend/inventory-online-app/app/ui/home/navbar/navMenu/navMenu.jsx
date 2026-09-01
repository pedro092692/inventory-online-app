import Link from 'next/link'

// Antes esto era un menú desplegable de 2 niveles (Funciones/Ventajas) cuyo
// contenido estaba cruzado: "Funciones" mostraba los ítems pensados para
// "Ventajas" y viceversa, y casi todos los enlaces apuntaban a "/" sin
// llevar a ningún lado real. Se simplificó a 2 anclas directas a secciones
// reales de la home. (El enlace a /advantages se quitó porque esa página
// todavía está vacía, sin contenido).
export function NavMenu() {
    return (
        <>
            <Link href='/#beneficios'>
                <p className='p1-r' style={{cursor: 'pointer'}}>Beneficios</p>
            </Link>

            <Link href='/#clientes'>
                <p className='p1-r' style={{cursor: 'pointer'}}>Clientes</p>
            </Link>
        </>
    )
}
