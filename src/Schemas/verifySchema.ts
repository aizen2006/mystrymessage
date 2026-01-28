import { z } from "zod";

export const VerifySchema = z.object({
    verifyCode: z.string().length(6,{message:"Verify code must be 6 characters"}),
});