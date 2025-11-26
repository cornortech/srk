import { UserModel } from "../model/userModel";

async function countDbUsers() {
  const userCount = await UserModel.countDocuments();

  console.log(`Total db users count : ${userCount}`);
}

export default countDbUsers;
