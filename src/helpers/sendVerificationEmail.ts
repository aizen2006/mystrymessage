import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "../types/apiResponse";
import UserModel from "../model/User.model";

async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    const expiryMinutes = 15;
    try {
        const response = await resend.emails.send({
            from: 'MystryMessage <support@genexecutive.xyz>',
            to: email,
            subject: 'Verification Code for MystryMessage',
            react: VerificationEmail({ code: verifyCode, firstName: username, expiryMinutes })
        });
        if(response.error){
            console.error('Email sending error:', response.error);
            return { success: false, message: 'Failed to send verification email' };
        }
        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, message: 'Failed to send verification email' };
    }
}
async function verifyEmail(email:string, verifyCode:string):Promise<ApiResponse>{
    try {
        const user = await UserModel.findOne({ email });
        if(!user){
            return { success: false, message: 'User not found' };
        }
        if(user.verifyCode !== verifyCode){
            return { success: false, message: 'Invalid verify code' };
        }
        if(user.verifyCodeExpiry < new Date()){
            return { success: false, message: 'Verify code expired' };
        }
        user.isVerified = true;
        await user.save();
        return { success: true, message: 'Email verified successfully' };
    } catch (error) {
        console.error('Email verification error:', error);
        return { success: false, message: 'Failed to verify email' };
    }
}

export { sendVerificationEmail, verifyEmail}