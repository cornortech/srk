import { Input, Button, Card, CardBody, Image } from '@nextui-org/react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '../../../store/useAuth';
import { TUser } from '../../../lib/types/entities';
import { updateUserDetailsApi } from '../../../lib/apiClient';
import useAlert from '../../../hooks/useAlert';
import { useSRKFileUpload } from '@srk/shared/hooks';

interface UpdateProfilePictureProps {
  userData: TUser;
}
export const UpdateProfilePicture = ({
  userData,
}: UpdateProfilePictureProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { userDetails } = useAuthStore();
  const { uploadFile } = useSRKFileUpload('university');
  const { show } = useAlert();
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (url: string) => {
      const userId = userDetails?._id;
      if (userId) {
        await updateUserDetailsApi({
          data: {
            country: userData.country,
            email: userData.email,
            dob: userData.dob,
            firstName: userData.firstName,
            gender: userData.gender,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber,
            profilePicture: url,
            isActive: userData.isActive,
          },
          userId,
        });
      }
    },
    onSuccess: () => {
      setProgress(0);
      setFile(null);
      show('Profile picture updated successfully', 'success');
    },
    onError: () => {
      show('Failed to update profile picture', 'error');
    },
  });

  const handleSubmit = () => {
    if (file) {
      uploadFile(file, 'image', (progress, url) => {
        setProgress(progress);
        if (url && progress === 100) {
          setProgress(100);
          mutate(url);
        }
      });
    }
  };

  return (
    <div>
      <Card className="bg-bgSecondary w-[100%]">
        <CardBody>
          <div className="flex items-center justify-center">
            <Image
              src={
                file
                  ? URL.createObjectURL(file)
                  : userData.profilePicture ||
                    'https://digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png'
              }
              width={200}
              height={200}
              className="object-cover rounded-full mx-auto mb-4"
            />
          </div>
          <form className="space-y-4">
            <Input
              size="lg"
              onChange={handleFileChange}
              type="file"
              label="Upload Profile Picture"
              accept="image/*"
            />
            <Button
              color="primary"
              disabled={!file}
              size="lg"
              className="text-black"
              onPress={handleSubmit}
            >
              {progress === 0 ? 'Upload' : `${progress}% Uploading...`}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
