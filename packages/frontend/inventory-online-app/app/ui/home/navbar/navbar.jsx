import styles from './page.module.css'
import { BrandMenu } from './brandMenu.jsx'
import { Button } from '../../utils/button/buttons'
import Link from 'next/link'

export function Navbar() {
    return (
        <div className={styles.navbar}>
            <BrandMenu />
            {/* <Button text={'Iniciar Sesión'}/> */}
            <Link href={'/login'}>
                <Button 
                    text={'Iniciar Sesión'} 
                    type='grey' 
                    showIcon={true} 
                    icon='person' 
                    size={[13.33, 13.33]}
                />
            </Link>
            
        </div>
    )

}