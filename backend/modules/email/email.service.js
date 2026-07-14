const sgMail = require('@sendgrid/mail')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mainColor = '#4f50de'

const sendVerificationEmail = async(usreEmail, token, firstName = 'there') =>{
    const verificationUrl =  `${process.env.FRONTEND_URL}/verify?token=${token}`

    const msg ={
        to: usreEmail,
        from: 'leonardo.lol.ldp@gmail.com',
        subject: 'Verify your MacroTracker account',
        text: `Click here to verify your account: ${verificationUrl}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #e3e4e9; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: ${mainColor}; margin-bottom: 0;">MacroTracker 🥗</h1>
                </div>
                <h2 style="text-align: center;">Welcome aboard!</h2>
                <p style="font-size: 16px;">Hi ${firstName},</p>
                <p style="font-size: 16px;">Thank you for registering. To start tracking your meals and crushing your goals, please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: ${mainColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Account</a>
                </div>
                <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link into your browser:<br> <a href="${verificationUrl}" style="color: ${mainColor};">${verificationUrl}</a></p>
                <p style="font-size: 14px; color: #999; margin-top: 40px; text-align: center;">Happy tracking!<br>The MacroTracker Team</p>
            </div>
        `
    }

    await sgMail.send(msg)
}

const sendWelcomeEmail = async(userEmail, firstName) => {
    const dashboardUrl = `${process.env.FRONTEND_URL}/login`

    const msg = {
        to: userEmail,
        from: 'leonardo.lol.ldp@gmail.com',
        subject: 'Welcome aboard! Your account is verified 🎉',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; border: 1px solid #e3e4e9; border-radius: 16px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: ${mainColor}; margin-bottom: 0;">MacroTracker 🚀</h1>
                </div>
                <h2 style="text-align: center;">You're all set!</h2>
                <p style="font-size: 16px;">Hi ${firstName},</p>
                <p style="font-size: 16px;">Your email has been successfully verified. Your MacroTracker account is now fully active.</p>
                <p style="font-size: 16px;">You can now log in, set your goals, and start tracking your progress right away.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${dashboardUrl}" style="background-color: ${mainColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">Go to Dashboard</a>
                </div>
                <p style="font-size: 14px; color: #999; margin-top: 40px; text-align: center;">Let's crush those goals!<br>The MacroTracker Team</p>
            </div>
        `
    }

    await sgMail.send(msg)
}


const sendAccountDeletedEmail = async (userEmail, firstName) => {
    const msg = {
        to: userEmail,
        from: 'leonardo.lol.ldp@gmail.com',
        subject: 'Account Deleted Successfully',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h2 style="color: #f1274e;">Account Deleted</h2>
                <p>Hi ${firstName},</p>
                <p>We're sorry to see you go. This email confirms that your MacroTracker account and all associated data have been permanently removed.</p>
                <p>If you didn't request this, please contact us immediately.</p>
                <p>Best regards,<br>The MacroTracker Team</p>
            </div>
        `
    }
    await sgMail.send(msg)
}
module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendAccountDeletedEmail
}