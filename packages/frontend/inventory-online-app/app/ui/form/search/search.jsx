import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './search.module.css'

export default function Search ({ placeHolder="Buscar...", }) {
    return (
        <Form className={styles.form}>
            <Input  type="search" 
                    name="search" 
                    placeHolder={placeHolder} 
                    icon="search" 
                    className={styles.input}
                    autoFocus={true}
            />
        </Form>
    )
}