export default async function HandlePageChange(currentPage, setOffset, limit, fetchData, searchTerm=null) {
    setOffset((currentPage - 1) * limit)
    if (!searchTerm) {
        await fetchData(limit, (currentPage - 1) * limit)
    }else {
        await fetchData(limit, (currentPage - 1) * limit, searchTerm)
    
    }
}