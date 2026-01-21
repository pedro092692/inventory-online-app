import { useSearchParams } from 'next/navigation'

export default function GetPageParam(param) {
    const searchParam = useSearchParams()
    let result = null
    if (param == 'page') {
        result = searchParam.get(param) ? parseInt(searchParam.get('page')) : 0
        return result - 1 >= 0 ? result  -1 : 0
    }
    
    result = searchParam.get(param) ? searchParam.get(param) : null
    return result

}