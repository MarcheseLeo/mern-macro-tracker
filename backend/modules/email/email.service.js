const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = async(usreEmail, token) =>{
    const verificationUrl =  `${process.env.FRONTEND_URL}/verify?token=${token}`

    const msg ={
        to: usreEmail,
        from: 'leonardo.lol.ldp@gmail.com',
        subject: 'Email verification for MacroTracker',
        text: `Click here to verify your account: ${verificationUrl}`,
        html: `<strong>Click the link to confirm: <a href="${verificationUrl}">Verify Account</a></strong>`
    }

    await sgMail.send(msg)
}

module.exports = {
    sendVerificationEmail
}