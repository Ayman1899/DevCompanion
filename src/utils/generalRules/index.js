
import joi from "joi"
import { Types } from "mongoose"

export const customId = (value, helper) => {
    let data = Types.ObjectId.isValid(value)
    return data ? value : helper.message("Id is not valid")
}

export const generalRules = {
    email: joi.string().email({tlds:{allow: false,deny:["outlook"]} /*true allow:["com","net","org"]*/,minDomainSegments:2,maxDomainSegments:3}).required(),
    password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    headers: joi.object({
        authorization: joi.string().required(),
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'content-length': joi.string(),
        host: joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
        //token: joi.string().required()
    })

}