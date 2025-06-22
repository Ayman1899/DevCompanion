
import jwt from "jsonwebtoken";
export const generateToken = async ({payload = {}, SIGNATURE/*, options = {expiresIn: "1h"}*/}) => {
    return jwt.sign(
        payload,
        SIGNATURE
        //options
    )
}