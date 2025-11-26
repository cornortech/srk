import IUser, { UserModel } from "../model/userModel";

async function updateUserScript(email: string, { data }: { data: Partial<IUser> }) {
  console.log("Updating user:", email, "with data:", data);
  await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        ...data,
      },
    }
  );
}


export default updateUserScript;