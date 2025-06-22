import bcrypt from 'bcrypt'
export const hash = async ({key, SALT_ROUNDS = process.env.SALT_ROUNDS}) => {
    return bcrypt.hashSync(key, Number(SALT_ROUNDS))//Number method is the same as adding a plus before the rounds to convert it into a number
}