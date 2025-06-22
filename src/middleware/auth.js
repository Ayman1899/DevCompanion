
import { userModel } from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error/index.js";
import { verifyToken } from "../utils/token/index.js";



export const authentication = asyncHandler(async (req,res,next) => {
        
            const { authorization } = req.headers;
            // if(!authorization) {
            //     return res.status(400).json({msg:"Token not found"})
            // }
    
            const [prefix, token] = authorization.split(" ") || []
            if(!prefix || !token) {
                //res.status(400).json({msg:"Token not found"})
                return next(new Error("Token not found", {cause: 400}))
            }
            //console.log(prefix+"\n"+token);
            
            let SIGNATURE_TOKEN = undefined
            if(prefix == "admin"){
                SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_ADMIN
            }else if (prefix == "bearer") {
                SIGNATURE_TOKEN = process.env.SIGNATURE_TOKEN_USER
            } else{
                return next(new Error("Invalid Token prefix", {cause: 400}))
            }
            
            //const decodedToken = jwt.verify(token, SIGNATURE_TOKEN)
            const decodedToken = await verifyToken({
                token,
                SIGNATURE: SIGNATURE_TOKEN
            })
            
            
            if(!decodedToken?.id){
                return next(new Error("Invalid Token payload",{cause:400}))
            }
            const user = await userModel.findById(decodedToken.id).select("-password").lean({virtuals:["Fullname"]})
            
            
            if(!user){
                return res.status(400).json({msg:"User not found"});
            }
            req.user = user;
            req.token = token
            next()
    //     } catch (error) {
    //         if(error?.name == "JsonWebTokenError"){
    //             return res.status(500).json({msg:"JsonWebTokenError"})
    //         }
    //         else if(error?.name == "TokenExpiredError"){
    //             return res.status(500).json({msg:"token expired"})    
    //         }
    //         return res.status(500).json({msg:"Internal server error...\n", error, message:error.message, stack:error.stack})
    // }
})


export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req,res,next) => {
            if (!accessRoles.includes(req.user.role)) {
                return next(new Error("Access Denied",{cause: 403}))
            }
            next()
    }
)
}