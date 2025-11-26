import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { taskContract } from "../../contract/task/contract";
import { socialTaskPackageModel } from "../../model/socialTaskPackageModel";

const getSocialTaskPackage: AppRouteImplementationOrOptions<typeof taskContract.getSocialTaskPackage> = async ({ req, res }) => {
    try {
        const allPackages = await socialTaskPackageModel.find()
        return {
            status: 200,
            body: {
                message: "Package Successfully Fetched",
                result: allPackages,
                success: true
            }
        }
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            body: {
                success: false,
                message: "Internal server error",
            },
        };
    }
}

export const taskQueryHandler = {
    getSocialTaskPackage
}
