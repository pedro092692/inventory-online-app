import axios from 'axios'

export default async function getData(url, method, body=null,) { 
    try {
        const response = await axios({
            url: url,
            method: method,
            data: body,
            withCredentials: true
        })
        return response.data
    } catch (error) {
        if(error.response) {
            throw {
                status: error.response.status,
                message: error.response.data?.errors || 'Something went wrong'
            }
        }

        throw {
            status: 500,
            message: 'Something went wrong'
        }
    }

}