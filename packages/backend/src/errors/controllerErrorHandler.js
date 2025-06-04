import { NotFoundError } from "./NofoundError.js"
import { ValidationError } from "sequelize"

class controllerErrorHandler { 
    
    handler(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next)
            }catch(error) {
                this.controllerError(error, res)
            }
        }
    }

    controllerError(error, res) {
        if(error instanceof NotFoundError) {
            return res.status(404).json({error: error.message});
        }
        
        if(error instanceof ValidationError) {
            return res.status(400).json({error: error.message})
        }
        return res.status(500).json({ error: error.message })
    }
}

export default controllerErrorHandler