import { initializeApp, cert } from "firebase-admin/app";

import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)

initializeApp({
    credential: cert(serviceAccount)
});

export const sendNotification = async (notification = {}, data = {}, tokens = []) => {
const message = {
    notification,
    data,
    tokens
}
    const response = await getMessaging().sendEachForMulticast(message)
//     console.log(response);
//     response.responses.forEach((r, i) => {
//     if (!r.success) {
//     return console.log(`Token ${i} failed: ${r.error.message} (code: ${r.error.code})`) ;
//     }
// });
    return response
    
}
