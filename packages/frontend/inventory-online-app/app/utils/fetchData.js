import axios from 'axios'

export default async function getData(url, method) { 
    try {
        const response = await axios({
            url: url,
            method: method,
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error)
        if(error.response) {
            console.log(error.response.status)
            console.log(error.response.data.message)
        }
    }

}