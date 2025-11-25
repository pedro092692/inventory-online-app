export default async function HandlePageChange(currentPage, setOffset, limit, fetchData) {
    setOffset((currentPage - 1) * limit)
    await fetchData(limit, (currentPage - 1) * limit)

}