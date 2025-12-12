// import { AppRouteImplementation } from "@ts-rest/express";

// const createGrowSocialMediaEnrollement:AppRouteImplementation<
// typeof growContract.createGrowSocialMediaEnrollement
// > = async ({ req, body }) => {
//     try {
        
//         const {
//             fullName,
//             email,
//             phoneNumber,
//             socialMediaPlatform,
//             profileLink,
//             packageId,
//         } = req.body;

//     } catch (error) {
//         console.error("Error creating grow social media enrollement:", error);
//         return {
//             status: 500,
//             body: {
//                 success: false,
//                 message: "Internal server error",
//             },
//         };
//     }
// }

// export const growMutationHandler = {
//     createGrowSocialMediaEnrollement,
// }