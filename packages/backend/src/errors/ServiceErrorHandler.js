import { ValidationError } from "sequelize"

class ServiceErrorHandler {

    async handler(kwargs, fn) {   
        try {
            return await fn()
        }catch(error) {
            this.serviceError(kwargs, error)
        }

    }

    serviceError(kwargs, error) {
        /* 
         This funcion throw new erros on service operacion 
         kwargs can be have three options:
         1. Service funcion (Create User, Read User, Delete User)
         2. Id of desired data (1, 8, 9)
         3. Model name (User, Invoice)
        */

        console.error('Error', error)

        if(error instanceof ValidationError) {
            throw new ValidationError(`Faile ${kwargs[0]} errors: ${error.message}`)
            
        }

        throw new Error(`Error in: ${error.message}`)
    }
}


export default ServiceErrorHandler