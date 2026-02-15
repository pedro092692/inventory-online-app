import { useParams } from "next/navigation"

export default function GetParam(param) {
    const params = useParams()
    return params[param] ? params[param] : null

}