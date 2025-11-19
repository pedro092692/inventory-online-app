import { Container } from '@/app/ui/utils/container'
import styles from './pagination.module.css'

export default function Pagination({currentPage, totalPages, maxVisiblePages, onPageChange}) {
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
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber} 
                        </p>
                    )
                })}
        </Container>
    )
}