const updatePagination = (setTotalPages, setCurrentPage, total = 0, limit = 10, currentPage = 1) => {
        if(!setCurrentPage || !setTotalPages ){
            return
        }
        setTotalPages(Math.ceil(total / limit))
        setCurrentPage(currentPage)
        
}

export { updatePagination }