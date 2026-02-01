import dbConnect from "./dbConnect";
import UserModel from "../model/User.model";

export async function getUserFromDb(email: string) {
  await dbConnect();
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    console.error("DB error", error);
    return null;
  }
};
