import joi from "joi";
import { customId, generalRules } from "../../utils/generalRules/index.js";



export const signUpSchema = joi.object({
        firstName: joi.string().alphanum().min(3).max(8).required().messages({
            "string.min":"Name is too short",
            "string.max":"Name is too long",
            "any.required":"Name is required"
        }),
        lastName: joi.string().alphanum().min(3).max(8).required().messages({
            "string.min":"Name is too short",
            "string.max":"Name is too long",
            "any.required":"Name is required"
        }),
        email: generalRules.email,
        //password: generalRules.password,
        
        //phone: joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).required(),
        //role: joi.string().valid("User","Admin"),
    }).unknown(true)

export const confirmEmailSchema = joi.object({
    email: generalRules.email.required(),
    code: joi.string().length(6).required()
})
