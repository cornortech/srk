import { Button, Card, CardBody } from "@nextui-org/react";
import { TUser } from "../../../lib/types/entities";
import { useMutation } from "@tanstack/react-query";
import { updateUserDetailsApi } from "../../../lib/apiClient";

interface AccountStatusProps {
  userDetails: TUser;
}
export const AccountStatus = ({ userDetails }: AccountStatusProps) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const userId = userDetails._id;
      await updateUserDetailsApi({
        data: {
          country: userDetails.country,
          email: userDetails.email,
          dob: userDetails.dob,
          firstName: userDetails.firstName,
          gender: userDetails.gender,
          lastName: userDetails.lastName,
          phoneNumber: userDetails.phoneNumber,
          profilePicture: userDetails.profilePicture,
          isActive: false,
        },
        userId,
      });
    },
  });
  return (
    <Card className="bg-bgSecondary">
      <CardBody>
        {userDetails.isActive && (
          <p className="text-gray-300">Your account is currently active.</p>
        )}
        <Button color="danger" className="mt-4" onPress={() => mutate()}>
          Deactivate Account
        </Button>
      </CardBody>
    </Card>
  );
};
