import express from "express"
import Database from "./database/database.js"
import UserRoutes from "./routes/UserRoutes.js"

class Server {
    constructor(){
        this.app = express()
        this.port = 4000,
        this.db = new Database()
        //app middlewares
        this.middlewares()
        
        // app routes
        this.routes()

    }

    middlewares(){
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
    }

    routes(){
        this.app.get('/', (req, res) => res.send(`Hello world`))

        // user routes
        this.app.use("/api/users", new UserRoutes().router)
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://127.0.0.1:${this.port}`)
        })
    }
}

export default Server
