export default async function HandlePageChange(currentPage, setOffset, limit, fetchDataFn, searchTerm=null) {
    setOffset((currentPage - 1) * limit)
    if (!searchTerm) {
        await fetchDataFn(limit, (currentPage - 1) * limit)
    }else {
        await fetchDataFn(limit, (currentPage - 1) * limit, searchTerm)
    
    }
}