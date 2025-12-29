import { useSearchParams } from 'next/navigation'

export default function GetPageParam(param) {
    const searchParam = useSearchParams()
    const page = searchParam.get(param) ? parseInt(searchParam.get('page')) : 0
    return page - 1 >= 0 ? page - 1 : 0
}