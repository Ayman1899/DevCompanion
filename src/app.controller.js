import { checkDBconnection } from "./DB/DBconnection.js"
import { requestRouter } from "./Modules/Requests/requests.controller.js";
import { teamRouter } from "./Modules/Teams/teams.controller.js";
import { userRouter } from "./Modules/User/user.controller.js";
import { globalErrorHandling } from "./utils/error/index.js";
import cors from 'cors'
export const bootstrap = (app, express) => {
    app.use(cors())
    checkDBconnection();
    app.use(express.json())
    app.get('/', (req, res) => res.status(200).json('Welcome to our app => DevCompanion'))

    app.use("/users", userRouter)

    app.use("/requests", requestRouter)

    app.use("/teams", teamRouter)




    app.use(/(.*)/, (req,res,next) => {
        return next(new Error(`Invalid URI => ${req.originalUrl}`))
    })
    app.use(globalErrorHandling)
}