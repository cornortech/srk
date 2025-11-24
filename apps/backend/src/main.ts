import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import connectDB from "./config/database";
// import { UserModel } from "./model/userModel";
// import { affiliateRequestModel } from "./model/affiliateRequestModel";
// import { balanceModel } from "./model/balanceModel";
// import AuthService from "./services/authService";

connectDB();

// (async () => {
//   try {

//     const affiliateRequests = await affiliateRequestModel.find<{
//       userId: {
//         firstName: string;
//         lastName: string;
//         email: string;
//       };
//     }>({
//       // requestedAt: {
//       //   $gte: new Date("2025-08-01T14:55:56.112+00:00"),
//       // },
//     }).populate("userId");
//     // console.log("Affiliate Requests:", affiliateRequests.length);
//     for (const request of affiliateRequests) {
//       // Process each affiliate request
//       // console.log("Processing Affiliate Request:", request);

//       const balanceExist = await balanceModel.findOne({
//         userId: request.userId,
//       });

//       if (!balanceExist) {
//         // Create a new balance document if it doesn't exist
//         // const newBalance = new balanceModel({
//         //   userId: request.userId,
//         // });
//         // await newBalance.save();
//         console.log(`no balance: ${request.userId?.firstName} ${request.userId?.lastName}`);
//       } else {
//         console.log(`Balance already exists for user: ${request.userId?.firstName} ${request.userId?.lastName}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error during server initialization:", error);
//     process.exit(1);
//   }
// })();

const PORT = Number(process.env.PORT || 4000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
