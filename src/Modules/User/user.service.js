

import { roles, userModel } from "../../DB/models/user.model.js"
import { decrypt } from "../../utils/encryption/decrypt.js"
import { encrypt } from "../../utils/encryption/encrypt.js"
import { asyncHandler } from "../../utils/error/index.js"
import { compare } from "../../utils/hashing/index.js"
import { hash } from "../../utils/hashing/index.js"
import { eventEmitter } from "../../utils/sendEmail.events/index.js"
import { generateToken } from "../../utils/token/generateToken.js"
import { verifyToken } from "../../utils/token/verifyToken.js"
// ---------------------------------------- SIGN UP ------------------------------------------------------------------------
export const signUp = asyncHandler(async (req,res,next) => {
    const {firstName, lastName, email, password, latitude, longitude, imageUrl, isGraduated, specialization, technology, hasProjects, biography, reasonToJoin, fcmToken} = req.body
    //if(password !== cPassword) {
    //    return next(new Error("Passwords don't match",{cause:400}))
    //}
    const emailExists = await userModel.findOne({email})
    if(emailExists) {
        return next(new Error("Email already exists",{cause:400}))
    }
    //const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const hashed = await hash({key: password, SALT_ROUNDS: process.env.SALT_ROUNDS})
    const user = await userModel.create({firstName, lastName, email, password: hashed, latitude, longitude, imageUrl, isGraduated, specialization, technology, hasProjects, biography, reasonToJoin, fcmToken})
    eventEmitter.emit("sendEmailConfirmation", { email })
    return res.status(200).json({msg:"Done", user})
})
// --------------------------------------------- OTP CONFIRMATION ------------------------------------------------------
export const confirmEmail = asyncHandler(async (req,res,next) => {
    const { email, code } = req.body;
    const user = await userModel.findOne({email, confirmed: false})
    if(!user) {
        return next(new Error("User doesn't exist or already confirmed", {cause: 404}))
    }
    
    if(!await compare({key: code, hashed: user.otpEmail})) {
        return next(new Error("Invalid code", {cause: 404}))
    }
    await userModel.updateOne({ email }, {confirmed: true, $unset: {otpEmail: 0}})
    // user.confirmed = true;
    // user.save()
    return res.status(200).json({msg:"Done"})
})

//------------------------------------------ SIGN IN ----------------------------------------------------------------


export const signIn = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;
    const user = await userModel.findOne({email, confirmed: true})
    if(!user) {
        return next(new Error("User doesn't exist or not confirmed yet",{cause:403}))
    }
    //const match = bcrypt.compareSync(password, user.password)
    const match = await compare({key: password, hashed: user.password})
    if(!match) {
        return next(new Error("Invalid Email or Password",{cause:400}))
    }
    //const token = jwt.sign({id:user._id}, user.role == "User" ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN, {expiresIn:"1h"})
    const token = await generateToken({
        payload: {email, id: user._id},
        SIGNATURE: user.role = roles.user ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN
        //options: {expiresIn:"1hr"}
    })
    res.status(200).json({msg:"Welcome!", token})
}
)
// ------------------------------------ GET PROFILE ---------------------------------------------------
export const getProfile = asyncHandler(async (req,res,next) => {
if(!req.token) {
    return next(new Error("Token not found", {cause:400}))
}
if(!req.user) {
    return next(new Error("User not found", {cause:400}))
}
const user = req.user;
//const phone = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPTION).toString(CryptoJS.enc.Utf8)

//const phone = decrypt({key: user.phone, secret_key: process.env.ENCRYPTION})
res.status(200).json({msg:"Done", ...user})
})



// --------------------------------------------------- GET USERS BY SPECS ---------------------------------------------
export const getBySpecialization = asyncHandler(async (req,res,next)=>{
    const { desiredSpecialties } = req.query
    const match = await userModel.find({specialization: desiredSpecialties}).select('Fullname firstName lastName isGraduated specialization technology hasProject biography _id').lean({virtuals:["Fullname"] })
    const cleanedMatch = match.map(user => ({
        isGraduated: user.isGraduated,
        specialization: user.specialization,
        hasProjects: user.hasProjects,
        biography: user.biography,
        technology: user.technology,
        Fullname: user.Fullname
    }));
    res.status(200).json({msg:"Done", cleanedMatch})
})
