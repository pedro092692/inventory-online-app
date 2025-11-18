import { Container } from '@/app/ui/utils/container'

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
            padding="0">
                {visiblePages.map((pageNumber, index) => {
                    return(
                        <p 
                            key={index}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            <a href="#">{pageNumber}</a>
                        </p>
                    )
                })}
        </Container>
    )
}