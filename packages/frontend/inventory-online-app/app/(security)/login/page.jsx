import { Container } from '@/app/ui/utils/container'
import { Logo } from '@/app/ui/utils/logo'
import LoginForm from '@/app/(security)/login/_components/loginForm'
import styles from './login.module.css'



export default async function Login({}) {
     return (
            <Container
            className={styles.section}
            >
                <Container
                    className={`shadow ${styles.formContainer}`}
                >
                    <Logo type='fullColorLogin'/>
                    <h1 className='h2'>Inicia sesión en Nexastock</h1>

                    <LoginForm/>
                    
                </Container>
      
            </Container>
    )
     
 }