import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Input,
  Button,
  Textarea,
  Card,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../components/FileUplaod';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createCourseApi, getAllPackagesApi } from '../../lib/apiClient';
import { TPackage } from '../../lib/types/entities';
import useAlert from '../../hooks/useAlert';
import { useSRKFileUpload } from '@srk/shared/hooks';

// interface Instructor {
//   name: string;
//   avatar: string;
//   bio: string;
// }

interface CourseFormValues {
  title: string;
  description: string;
  thumbnail: string;
}

export default function CreateCoursePage() {
  const [image, setImage] = useState<File | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string[]>([]);
  const { uploadFile } = useSRKFileUpload('university');
  const { show } = useAlert();
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const { data: AllPackages } = useQuery<TPackage[] | undefined>({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await getAllPackagesApi();
      return res;
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormValues>({
    defaultValues: {
      thumbnail: '',
      description: '',
      title: '',
    },
  });

  const navigate = useNavigate();

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      createCourseApi({
        description: data.description,
        image: data.thumbnail,
        package: selectedPackage,
        title: data.title,
      });
    },
    onSuccess: () => {
      show('Course created successfully', 'success');
      navigate('/admin/courses');
    },
    onError: () => {
      show('Error creating course', 'error');
    },
  });

  const onSubmit: SubmitHandler<CourseFormValues> = async (data) => {
    console.log(data, image);

    if (image) {
      await uploadFile(image, 'image', (progress, url) => {
        setUploadingPercentage(progress);
        if (url && progress === 100) {
          createCourse({
            description: data.description,
            thumbnail: url,
            title: data.title,
          });
        }
      });
    }
  };

  console.log(selectedPackage);

  return (
    <div className="min-h-screen p-6 w-full">
      <h1 className="text-2xl font-bold mb-4 text-white">Create New Course</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full grid md:grid-cols-3 gap-4"
      >
        {/* Basic Details */}
        <Card className="p-4 bg-bgSecondary col-span-2">
          <div className="space-y-4">
            <Input
              label="Title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter course title"
              isRequired
              errorMessage={errors.title?.message}
              classNames={{ inputWrapper: 'text-white' }}
            />
            <Textarea
              label="Description"
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Enter course description"
              isRequired
              errorMessage={errors.description?.message}
              classNames={{ input: 'text-white' }}
            />
            {AllPackages && (
              <Select
                aria-multiselectable
                selectionMode="multiple"
                className="max-w-xs"
                label="Select Package"
                selectedKeys={selectedPackage}
                onSelectionChange={(keys) => {
                  console.log('Selected keys:', keys);
                  setSelectedPackage(Array.from(keys) as string[]);
                }}
                placeholder="Select an Package"
                multiple
              >
                {AllPackages.map((animal) => (
                  <SelectItem key={animal._id}>{animal.title}</SelectItem>
                ))}
              </Select>
            )}
          </div>
        </Card>

        {/* File Input: Course Thumbnail */}
        <Card className="p-2 bg-bgSecondary w-full h-full">
          <FileUpload
            label="upload Thumbnail"
            onImageUpload={(file) => setImage(file)}
            image={image}
          />
        </Card>

        <Button type="submit" className="w-full col-span-2 " color="primary">
          {uploadingPercentage > 0 && uploadingPercentage < 100
            ? `${uploadingPercentage}% uploading video`
            : ''}
          {isPending ? 'Creating course...' : 'Create Course'}
        </Button>
      </form>
    </div>
  );
}
