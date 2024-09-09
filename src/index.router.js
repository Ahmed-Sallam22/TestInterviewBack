import helmet from 'helmet'
import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'

import { globalErrorHandling } from './utils/errorHandling.js'
import cors from 'cors'


const initApp = (app, express) => {
    app.use(helmet());

    app.use(cors({}))


    app.get('/', (req, res, next) => {
        res.send("Welcom to our project")
    })
    app.use(express.json({}))
    app.use(`/auth`, authRouter)


    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
   
 
    
    app.use(globalErrorHandling)

    connectDB()

}



export default initApp