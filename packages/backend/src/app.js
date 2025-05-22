import express from 'express'
import 'dotenv/config'
import process from 'process'

class Server {
    constructor(){
        this.app = express()
        this.port = 4000,
        this.routes()

    }

    routes(){
        const testDotEnv = process.env.TEST
        this.app.get('/', (req, res) => res.send(`Hello world ${ testDotEnv}`))
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://127.0.0.1:${this.port}`)
        })
    }
}

export default Server
