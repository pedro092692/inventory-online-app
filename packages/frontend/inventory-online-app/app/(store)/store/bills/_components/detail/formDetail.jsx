import { Form } from '@/app/ui/form/form/form'
import { Input } from '@/app/ui/form/input/input'

export default function BillDetailForm( { bill, readOnly = true }) {
    return (
        <>
        {bill &&
            <Form className={`shadow`}>
                <Input type="text" icon="person" value={`${bill?.customer?.name}`} name={'name'}  readOnly={readOnly}/>
                <Input type="text" icon="id" value={`${bill?.customer?.id_number}`} name={'id_number'}  readOnly={readOnly}/>
                <Input type="phone" icon="phone" value={`${bill?.customer?.phone}`} name={'phone'}  readOnly={readOnly}/>        
            </Form>
        }
        </>
    )
}