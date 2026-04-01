import { Form } from "@/app/ui/form/form/form"
import { Input } from "@/app/ui/form/input/input"
import { button } from "@/app/ui/utils/button/buttons"

export default function BulkProductsPage() {
    return (
        <>
            <h1>Carga masiva de products...</h1>
            <Form>
                <Input showIcon={false} icon='upload' type='file' name='productsFile' label='Archivo de productos' accept='.xlsx, .xls, .csv' />
                <button type="submit">Subir archivo</button>
            </Form>
        </>
        
    )
}