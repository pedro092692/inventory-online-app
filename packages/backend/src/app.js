import express from 'express'

class Server {
    constructor(){
        this.app = express()
        this.port = 4000,
        this.routes()

    }

    routes(){
        this.app.get('/', (req, res) => res.send('Hello world'))
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://127.0.0.1:${this.port}`)
        })
    }
}

export default Server
