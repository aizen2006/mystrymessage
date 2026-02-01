import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb } from "./src/lib/getUserFromDb";
import bcrypt from "bcryptjs"
import { signInSchema } from "./src/Schemas/signInSchema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        let user = null
 
        // logic to verify if the user exists
        const { email, password } = await signInSchema.parseAsync(credentials)
        user = await getUserFromDb(email);
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials")
        }
        if(!user.isVerified){
          throw new Error("Please verify your Email")
        }
        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect){
          throw new Error("Password is Incorrect")
        }
        // return plain object matching NextAuth User (exclude password, convert _id to string)
        return {
          _id: user._id.toString(),
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        };
      },
    })
  ],pages:{
    signIn: "/sign-in",
  },
  session:{
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessage = user.isAcceptingMessage
        token.username = user.username
      }
      return token
    },
    session({ session, token }) {
      if (session?.user && token) {
        session.user._id = token._id as string | undefined
        session.user.isVerified = token.isVerified as boolean | undefined
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean | undefined
        session.user.username = token.username as string | undefined
      }
      return session
    },
  },
})