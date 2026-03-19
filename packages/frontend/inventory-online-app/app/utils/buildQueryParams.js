export function buildQueryParams(searchParams, allowedKeys = []) {
    const params = new URLSearchParams()  
    for (const key of allowedKeys){
        const value = searchParams?.[key]
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, value)
        }
    }

  return params.toString()
}