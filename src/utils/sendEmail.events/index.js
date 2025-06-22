import { EventEmitter } from "events";
import { sendEmail } from "../../service/EmailSender.js";
import { hash } from "../hashing/index.js";
import { userModel } from "../../DB/models/user.model.js";
import { html } from "../../service/email-template.js";
import { customAlphabet } from "nanoid";
export const eventEmitter = new EventEmitter()
eventEmitter.on("sendEmailConfirmation", async (data) => {
    const { email } = data;
    const otp = customAlphabet("0123456789", 6)()
    const hashedOTP = await hash({key: otp, SALT_ROUNDS: process.env.SALT_ROUNDS})
    await userModel.updateOne({ email }, { otpEmail: hashedOTP })
    await sendEmail(email, "Confirm Email", html({ otp }));
})