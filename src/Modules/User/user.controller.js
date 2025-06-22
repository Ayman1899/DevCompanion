import { Router } from 'express'
import * as US from './user.service.js'
import { authentication, authorization } from '../../middleware/auth.js'
import { roles } from '../../DB/models/user.model.js'
import { validation } from '../../middleware/validation.js'
import { confirmEmailSchema, signUpSchema } from './user.validation.js'
export const userRouter = Router()
userRouter.post("/signUp", validation(signUpSchema), US.signUp)
userRouter.patch("/confirmEmail", validation(confirmEmailSchema), US.confirmEmail)
userRouter.post("/signIn",validation, US.signIn)
userRouter.get("/profile", authentication, authorization(roles.user), US.getProfile)
userRouter.get("/skillMatch", validation, US.getBySpecialization)