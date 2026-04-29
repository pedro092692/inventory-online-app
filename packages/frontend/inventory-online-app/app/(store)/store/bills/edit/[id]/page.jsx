import Route from '@/app/ui/routesLinks/routes'

export default async function EditInvoice({ params }) {
    const { id } = await params

    return (
        <>
            <Route path='bills' endpoints={['detail', 'edit']} id={id}/>
            <p>Welcome to edit invoice details {id}</p>
        </>
    )
}