import { useSearchParams } from 'next/navigation'

export default function GetPageParam() {
    const searchParam = useSearchParams()
    const page = searchParam.get('page') ? parseInt(searchParam.get('page')) : 0
    return page - 1 >= 0 ? page - 1 : 0
}