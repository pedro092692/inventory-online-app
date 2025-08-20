import styles from './page.module.css'
import { BrandMenu } from './brandMenu.jsx'
import { Button } from './button.jsx'

export function Navbar() {
    return (
        <div className={styles.navbar}>
            <BrandMenu />
            <Button />
        </div>
    )

}