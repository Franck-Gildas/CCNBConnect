import { INewUser } from "@/types";
import { ID } from "appwrite";
import { account, appwriteConfig } from "./config";

export const createUserAccount = async (user: INewUser) => {
  try {
    console.log(appwriteConfig);

    console.log(ID.unique(), user.email, user.password, user.name);
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    return newAccount;
  } catch (error) {
    console.log((error as Error).message);
    console.log((error as Error).stack);
    return error;
  }
};
