import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User.model";
import { z } from "zod";
import { VerifySchema } from "@/src/Schemas/verifySchema";

export async function POST(request:Request){
    await dbConnect();
    try {
        const { username , code } = await request.json()
        const  decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"Unable to find the user"
                },
                {status:500}
            )
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success:true,
                    message:"Account Verified Successfully"
                },
                {status:200}
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success:false,
                    message:"The Code is not Valid"
                },
                {status:400}
            )
        }else{
            return Response.json(
                {
                    success:false,
                    message:"The Code is Expired . Please Signup again"
                },
                {status:400}
            )
        }
    } catch (error) {
        console.error("Error while verifying code",error);
        return Response.json(
            {
                success:false,
                message:"Error while verifying code"
            },
            {
                status:500
            }
        )
    }
}
