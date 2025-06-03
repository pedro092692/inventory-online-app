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
        return res.status(500).json({ error: error.message })
    }
}

export default controllerErrorHandler