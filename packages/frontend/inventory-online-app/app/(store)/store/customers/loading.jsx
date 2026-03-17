import ListSkeleton from "@/app/ui/skeleton/listSkeleton"
import Route from '@/app/ui/routesLinks/routes'

export default function Loading() {
    return(
        <>
            <Route path='customers' endpoints={['add', 'default']} /> 
            <ListSkeleton nTitle={4} />
        </>
        
    )
    
}