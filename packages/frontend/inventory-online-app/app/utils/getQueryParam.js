import { useSearchParams } from 'next/navigation'

export default function GetQueryParam(param, type='string') {
    const searchParam = useSearchParams()
    let result = null
    
    if (type == 'pagination') {
        result = searchParam.get(param) ? parseInt(searchParam.get(param)) : 0
        return result - 1 >= 0 ? result  -1 : 0
    }
    
    result = searchParam.get(param) ? searchParam.get(param) : null
    
    return result

}