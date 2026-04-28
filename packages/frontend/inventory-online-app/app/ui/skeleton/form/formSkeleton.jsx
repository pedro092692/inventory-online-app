'use client'
import { Form } from '@/app/ui/form/form/form'
import styles from '@/app/(store)/store/customers/_components/detail/input.module.css'
import styles_input from './form.module.css'


export default function FormSkeleton({ nFields = 1, custonStyle = {}}) {

    return (
        <Form className={`${styles.formview} shadow`} style={custonStyle} onSubmit={(e) => e.preventDefault()} >
            {
                Array.from({length: nFields}).map((_, index) => {
                    return (
                        <div key={index} className={`${styles_input.input} skeleton`} style={{width: '100%'}} />
                    )
                })
            }
        </Form>
    )
}