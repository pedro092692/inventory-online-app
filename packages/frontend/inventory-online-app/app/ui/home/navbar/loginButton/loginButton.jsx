import Link from 'next/link'
import { Button } from '../../../utils/button/buttons'

export function LoginButton({isLogged=false, className = '', onClick}) {
    return (
        <Link href={isLogged ? '/store' : '/login'} className={className} onClick={onClick}>
            <Button type='secondary' showIcon={true} icon={isLogged ? 'store' : 'person'} size={[20, 20]} className='p2-r'>
                {isLogged ? 'Mi Negocio' : 'Iniciar Sesión'}
            </Button>
        </Link>
    )
}