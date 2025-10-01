import { Title } from "@/app/ui/dashboard/title/title"
import { Form } from "@/app/ui/form/form/form"
import { Input } from "@/app/ui/form/input/input"
import { Button } from "@/app/ui/utils/button/buttons"
import styles from './input.module.css'

export default function AddCustomer() {
    const background = '--color-neutralGrey300'
    const gap = '8px'
    return (
       <>
            <Form style={{width: '50%'}}>
                <Input type="text" placeHolder="Nombre del cliente" icon="person" gap={gap} backgroundColor={background}/>
                <Input className={styles.inputNumber} type="number" placeHolder="Cedula" icon="id" gap={gap} backgroundColor={background}/>
                <Input type="text" placeHolder="Telefono" icon="phone" gap={gap} backgroundColor={background}/>
                <Button>
                    Agregar cliente
                </Button>
            </Form>
       </>
    )
}