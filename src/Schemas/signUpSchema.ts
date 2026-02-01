import {z} from "zod";

export const usernameValidation = z
.string()
.min(4,"Username Should be atleast 4 characters")
.max(15,"Username Should be less than 15 character")
.regex(/^[A-Za-z0-9]{3,20}$/,"Username must not contain Special character")

export const SignUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,{message:"Password must be atleast 8 characters"}),
    confirmPassword: z.string().min(8,{message:"Password must be atleast 8 characters"}),
})