import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'


export default function SellerDetailForm({seller, readOnly = true}){

    return (
        <>
        {seller &&
            <Form className={`${styles.formview} shadow`}>
                <Input type="text" icon="person" value={`${seller?.name}`} name={'name'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="text" icon="cashier" value={`${seller?.last_name}`} name={'last_name'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="email" icon="mail" value={`${seller?.user?.email}`} name={'email'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="text" icon="id" value={`${seller?.id_number}`} name={'id_number'} className={styles.inputReadOnly} readOnly={readOnly}/>
                <Input type="text" icon="address" value={`${seller?.address}`} name={'address'} className={styles.inputReadOnly} readOnly={readOnly}/>        
            </Form>
        }
        </>
    )
}