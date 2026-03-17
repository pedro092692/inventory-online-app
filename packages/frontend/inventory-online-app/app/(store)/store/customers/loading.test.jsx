import ListSkeleton from "@/app/ui/skeleton/listSkeleton"
import Route from '@/app/ui/routesLinks/routes'
import Search from "@/app/ui/form/search/search"

export default function Loading() {
    return(
        <>
            <Route path='customers' endpoints={['add', 'default']} /> 
            <Search />
            <ListSkeleton nTitle={4} />
        </>
        
    )
    
}