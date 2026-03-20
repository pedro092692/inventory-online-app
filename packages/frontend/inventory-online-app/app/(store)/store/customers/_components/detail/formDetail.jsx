import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from './input.module.css'


export default function CustomerDetailForm({customer, readOnly = true}){

    return (
        <>
        {customer &&
            <Form className={`${styles.formview} shadow`}>
                <Input type="text" icon="person" value={`${customer?.name}`} name={'name'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="text" icon="id" value={`${customer?.id_number}`} name={'id_number'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="text" icon="phone" value={`${customer?.phone}`} name={'cellphone'} className={styles.inputReadOnly} readOnly={readOnly}/>        
            </Form>
        }
        </>
    )
}