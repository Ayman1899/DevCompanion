import nodemailer from 'nodemailer'
import { asyncHandler } from '../utils/error/index.js'


export const sendEmail = asyncHandler(async (to, subject, html, attachments) => { 
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        // debug: true,
        // logger: true
        
    })
    
    
    

        await transporter.sendMail({
            from: `"Mon :) <${process.env.email}>"`,
            to: to ? to: "monmoh200@gmail.com",
            subject: subject ? subject: "No subject have been given",
            html: html ? html: "<h1>No HTML has been given</h1>",
            attachments: attachments ? attachments: []
        });
    
})
