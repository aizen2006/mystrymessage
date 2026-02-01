import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username , isVerified:true });
        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success: false,
                message:"Username is already taken"
            },
            {
                status:400
            })
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return NextResponse.json({
                    success:false,
                    message: "User Already exists with this email "
                },
                {
                    status:500
                });
            }else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

                await existingUserVerifiedByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);
            const newUser = await new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages:[]

            })
            await newUser.save();
        }
        // send Verificcation email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message: emailResponse.message
            },
            {
                status:500
            })
        }
        return NextResponse.json({
            success:true,
            message:"User registerd Successfully. Please Verify your email."
        },
        {
            status:400
        })
    } catch (error) {
        console.error('Error in sign up:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Internal server error' 
            }, 
            { 
                status: 500
            }
        );
    }
}