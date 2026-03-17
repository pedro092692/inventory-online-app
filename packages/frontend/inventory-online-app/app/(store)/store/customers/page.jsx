import { Container } from "@/app/ui/utils/container"
import Route from '@/app/ui/routesLinks/routes'
import Search from "@/app/ui/form/search/search"

export default async function Customer({searchParams}) {
    await new Promise (resolve => setTimeout(resolve, 1000))
    const params = await searchParams


    return (
        <Container
            direction={'column'}
            alignItem={'start'}
            padding='0px'
            width='100%'
        >
        
            <Route path='customers' endpoints={['add', 'default']} /> 
            <Search />
        </Container>
       
    )
}