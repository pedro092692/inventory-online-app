import ServiceErrorHandler from '../../errors/ServiceErrorHandler'

class SecurityService {
    #error = new ServiceErrorHandler()

    constructor() {
        this.#error
    }
}


export default SecurityService