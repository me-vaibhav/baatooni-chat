import { PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE,SEND_WELCOME_EMAIL_TEMPLATE,VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { sender,mailtrapClient } from "./mailtrap.config.js";

export const sendVerificationEmail = async(email,verificationToken)=>{
    const recipient = [{email}]
    //agr multiple recipients hote to aisa syntax hota kuch 
    //[{email:'email!@gmail.com'},{email:'email1!@gmail.com'},{email:'email2!@gmail.com'},{email:'email3!@gmail.com'}]
    try {
    const response = await mailtrapClient.send({
        from:sender,
        to:recipient,
        subject:"verify your email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
        category:"Email Verification"
    })     
    console.log("Email sent successfully",response)
    } catch (error) {
        console.error(`Error sending verification`,error)
        throw new Error(`Error sending verification email : ${error}`)
    }
}

//Lets not waste more time doing these for now and move on for now 
// we can add reset password later

export const sendWelcomeEmail = async(email,username)=>{
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"welcome to AuthMail",
            html: SEND_WELCOME_EMAIL_TEMPLATE.replace("{name}",username),
            category:"welcome email"
        })
        console.log("Email sent successfully",response)
    } catch (error) {
        console.error(`Error sending welcome mail`,error)
        throw new Error(`Error sending welcome email : ${error}`)

    }
}