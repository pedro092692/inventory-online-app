import { Title } from "@/app/ui/dashboard/title/title"
import { Form } from "@/app/ui/form/form/form"
import { Input } from "@/app/ui/form/input/input"
import { Button } from "@/app/ui/utils/button/buttons"

export default function AddCustomer() {
    return (
       <>
            <Form>
                <Input type="text" placeHolder="Nombre del cliente" icon="person"/>
                <Input type="number" placeHolder="Cedula" icon="person"/>
                <Input type="text" placeHolder="Telefono" icon="person"/>
                <Button>
                    Agregar cliente
                </Button>
            </Form>
       </>
    )
}