import bcrypt from "bcrypt"
export const compare = async ({key, hashed}) => {
    return bcrypt.compareSync(key, hashed)
}