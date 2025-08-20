import styles from './page.module.css'
import { Navbar } from '../navbar/navbar.jsx'

export function Hero() {
    console.log('styles:', styles.hero)
    return (
        <Navbar />
    )
}