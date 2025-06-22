import CryptoJS from "crypto-js";
export const decrypt = ({key, secret_key}) => {
    return CryptoJS.AES.decrypt(key, secret_key).toString(CryptoJS.enc.Utf8)
}