import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Input,
  Button,
  Textarea,
  Card,
  CardHeader,
  CardBody,
} from '@nextui-org/react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
} from '@nextui-org/modal';
import { PrimaryButton } from '../../components/ReusableComponents';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCourseDetailsByIdApi,
  getCourseVideoByCourseId,
  uploadVideoApi,
} from '../../lib/apiClient';
import { TCourse, TCourseVideo } from '../../lib/types/entities';
import { TUploadVideoPayload } from '../../lib/types';
import useAlert from '../../hooks/useAlert';
import { AxiosError } from 'axios';
import { useSRKFileUpload } from '@srk/shared/hooks';

interface Video {
  url: string;
}

interface Chapter {
  name: string;
  videos: Video[];
}

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [chapterName, setChapterName] = useState('');
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editableCourse, setEditableCourse] = useState<TCourse | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { uploadFile } = useSRKFileUpload('university');
  const { show } = useAlert();
  console.log('chapters', chapters);

  const { data: course } = useQuery<TCourse | undefined>({
    queryKey: ['courseDetails', id],
    queryFn: () => {
      if (!id) return;
      return getCourseDetailsByIdApi(id);
    },
    enabled: !!id,
  });
  const { invalidateQueries } = useQueryClient();

  const { data: courseVideos } = useQuery<TCourseVideo[] | undefined>({
    queryKey: ['videosOfCourse', course?._id],
    queryFn: () => {
      if (!course) return;
      return getCourseVideoByCourseId(course._id);
    },
    enabled: !!course?._id,
  });
  const { mutate: uploadVideoMutation } = useMutation({
    mutationKey: ['uploadVideo'],
    mutationFn: async (data: TUploadVideoPayload) => {
      const res = await uploadVideoApi(data);
      return res;
    },
    onSuccess: () => {
      setFile(null);
      setChapterName('');
      setProgress(0);
      invalidateQueries({ queryKey: ['videosOfCourse'] });
      show('Video uploaded successfully', 'success');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setProgress(0);
      show(error.response?.data.message || 'Failed to upload video', 'error');
    },
  });
  useEffect(() => {
    if (course) {
      setEditableCourse(course);
    }
    const savedChapters = localStorage.getItem(`chapters_${id}`);
    if (savedChapters) {
      setChapters(JSON.parse(savedChapters));
    }
  }, [id, course]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setChapterName(e.target.files[0].name);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src); // Clean up
        resolve(video.duration);
      };

      video.onerror = () => {
        reject(new Error('Error loading video metadata'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !chapterName) return;
    try {
      const duration = await getVideoDuration(file);
      const { url } = await uploadFile(file, 'video', (progress, url) => {
        setProgress(progress);
        if (url && progress === 100) {
          setProgress(100);
        }
      });

      uploadVideoMutation({
        courseId: course?._id || '',
        duration, // Set the actual duration
        name: chapterName,
        videoUrl: url,
      });
    } catch (error) {
      console.error('Error getting video duration:', error);
    }
  };

  const handleEditChange = () => {
    // setEditableCourse({
    //   ...editableCourse,
    //   [e.target.name]: e.target.value,
    // });
  };

  const handleSave = () => {
    if (!course) return;
  };

  if (!course) {
    return <div></div>;
  }

  return (
    <div className="max-w-3xl space-y-4 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{editableCourse?.title}</h2>
        <PrimaryButton
          label="Edit Course"
          // className="px-6 py-4 bg-yellow-600"
          onclick={onOpen}
        />
      </div>
      <img
        src={editableCourse?.image}
        alt={editableCourse?.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-300 mb-4">{editableCourse?.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6"></div>

      <Card>
        <CardHeader>Upload new Video</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Input
                id="chapterName"
                label="Video title:"
                type="text"
                placeholder="Enter video title"
                labelPlacement="outside"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="videoFile" className="block mb-2">
                Video File:
              </label>
              <input
                id="videoFile"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <Button
              color="primary"
              type="submit"
              disabled={progress > 0}
              className="w-full  text-white font-bold py-2 px-4 rounded"
            >
              {progress > 0 ? `${progress}% Uploading` : 'Upload video'}
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 ">
        {courseVideos?.map((video) => (
          <Card className="">
            <CardHeader>{video.name}</CardHeader>
            <CardBody>
              <video controls className="w-full h-64 object-cover rounded-lg">
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </CardBody>
          </Card>
        ))}
      </div>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-xl font-bold">Edit Course Details</h3>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  name="title"
                  fullWidth
                  value={editableCourse?.title}
                  onChange={handleEditChange}
                />
                <Input
                  label="Image URL"
                  name="img"
                  fullWidth
                  value={editableCourse?.image}
                  onChange={handleEditChange}
                />
                <Textarea
                  label="Description"
                  name="description"
                  fullWidth
                  value={editableCourse?.description}
                  onChange={handleEditChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button onPress={handleSave}>Save</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CourseDetail;
