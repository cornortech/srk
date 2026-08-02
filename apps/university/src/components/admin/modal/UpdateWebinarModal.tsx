import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Image,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { z } from "zod";
import { TWebinar } from "../../../lib/types/entities";
import { useSRKFileUpload } from "@srk/shared/hooks";
import { getUniversityAssetUrl } from "../../../lib/cdn";
import useAlert from "../../../hooks/useAlert";

const webinarSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    hasFinished: z.boolean(),
    meetUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
    thumbnail: z.string().optional(),
  })
  .refine((data) => (data.hasFinished ? !!data.youtubeUrl : !!data.meetUrl), {
    message: "Provide a YouTube URL for a finished webinar, or a meeting URL for an upcoming one",
    path: ["meetUrl"],
  });

type UpdateWebinarModalProps = {
  webinar: TWebinar;
  onUpdate: (updatedData: TWebinar) => void;
  trigger: React.ReactElement;
};

export default function UpdateWebinarModal({
  webinar,
  onUpdate,
  trigger,
}: UpdateWebinarModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<TWebinar>(webinar);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useSRKFileUpload("university");
  const { show } = useAlert();

  useEffect(() => {
    setFormData(webinar);
    setNewThumbnail(null);
    setErrors({});
  }, [webinar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    let thumbnail = formData.thumbnail;

    if (newThumbnail) {
      try {
        setIsUploading(true);
        const { key } = await uploadFile(newThumbnail, "image");
        thumbnail = key;
      } catch {
        show("Failed to upload thumbnail", "error");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const candidate = {
      ...formData,
      thumbnail,
      meetUrl: formData.hasFinished ? undefined : formData.meetUrl,
      youtubeUrl: formData.hasFinished ? formData.youtubeUrl : undefined,
    };

    const result = webinarSchema.safeParse(candidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate(candidate);
    onClose();
  };

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: onOpen,
      })}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Update Webinar</ModalHeader>
              <ModalBody className="flex flex-col gap-3">
                <Input
                  name="title"
                  label="Title"
                  value={formData.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                  errorMessage={errors.title}
                />

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Thumbnail</p>
                  <Image
                    src={
                      newThumbnail
                        ? URL.createObjectURL(newThumbnail)
                        : getUniversityAssetUrl(formData.thumbnail)
                    }
                    alt={formData.title}
                    className="w-full aspect-video object-cover"
                    width={500}
                    height={280}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewThumbnail(file);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-default-100 rounded-lg">
                  <span className="text-sm font-medium">Webinar has finished</span>
                  <Switch
                    isSelected={formData.hasFinished}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, hasFinished: value }))
                    }
                    color="success"
                    size="sm"
                  />
                </div>

                {formData.hasFinished ? (
                  <Input
                    name="youtubeUrl"
                    label="YouTube URL"
                    value={formData.youtubeUrl || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.youtubeUrl}
                    errorMessage={errors.youtubeUrl}
                  />
                ) : (
                  <Input
                    name="meetUrl"
                    label="Meeting URL"
                    value={formData.meetUrl || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.meetUrl}
                    errorMessage={errors.meetUrl}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isUploading}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
