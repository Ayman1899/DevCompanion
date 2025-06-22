import CryptoJS from "crypto-js";
export const encrypt = ({key, secret_key}) => {
    return CryptoJS.AES.encrypt(key, secret_key).toString()
}