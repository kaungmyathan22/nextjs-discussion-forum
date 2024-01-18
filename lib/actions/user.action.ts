"use server";

import User from "@/database/use.model";
import { connectToDatabase } from "../mongoose";

export const getUserById = async (params: any) => {
  try {
    connectToDatabase();
    const { userId } = params;
    // get user by id
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
