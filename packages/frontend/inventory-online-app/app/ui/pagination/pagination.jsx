'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Container } from '@/app/ui/utils/container'
import styles from './pagination.module.css'
import Link from 'next/link'
export default function Pagination({totalPages, maxVisiblePages = 8}) {
    
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1

    const createPageURL = (page) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        return `${pathname}?${params.toString()}`
    }
    
    const geVisiblePages = () => {
        const pages = [1]
        let start = 2


        if(currentPage - 1 > 1){
            start = currentPage
        }

        if(currentPage + maxVisiblePages > totalPages){
            start = totalPages - (maxVisiblePages - 1)
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
                    <Link href={createPageURL(pageNumber)} 
                        key={index}
                        className={`${styles.page} p2-b` + (pageNumber === currentPage ? ` ${styles.active}` : '')}
                    >
                        {pageNumber} 
                    </Link>
                )
            })}
        </Container>
    )
}