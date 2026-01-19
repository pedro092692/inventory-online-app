import { Container } from '@/app/ui/utils/container'
import styles from './pagination.module.css'
import HandlePageChange from '@/app/utils/handlePageChange'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function Pagination({currentPage, totalPages, maxVisiblePages, setOffet, limit, fetchData, param, searchTerm=null}) {

    const searchParams = useSearchParams()
    const router = useRouter()
    const params = new URLSearchParams(searchParams.toString())
    const geVisiblePages = () => {
        const pages = [1]
        let start = 2


        if(currentPage - 1 > 1){
            start = currentPage
        }

        if(currentPage + 8 > totalPages){
            start = totalPages - 7
        }

        for(let i = 0; i < maxVisiblePages; i++){
            if(i+start >= 2){
                pages.push(i+start)
            }
        }
        
        return pages
    }

    const visiblePages = geVisiblePages()

    const changePage = (pageNumber) => {
        HandlePageChange(pageNumber, setOffet, limit, fetchData, searchTerm)
        params.set(param, pageNumber)
        router.replace(`?${params.toString(pageNumber)}`)
    }

    return (
        <Container
            padding="0"
            gap="4px"
        >
                {visiblePages.map((pageNumber, index) => {
                    return(
                        <p 
                            key={index}
                            className={`${styles.page} p2-b` + (pageNumber === currentPage ? ` ${styles.active}` : '')}
                            onClick={() => changePage(pageNumber)}
                        >
                            {pageNumber} 
                        </p>
                    )
                })}
        </Container>
    )
}