import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import { z } from "zod";
import { TWebinar } from "../../../lib/types/entities";

const webinarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  meetUrl: z.string().url("Invalid URL"),
  startTime: z.string().min(1, "Start time required"),
  endTime: z.string().min(1, "End time required"),
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(webinar);
    setErrors({});
  }, [webinar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const result = webinarSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate(formData);
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
                <Input
                  name="meetUrl"
                  label="Meeting URL"
                  value={formData.meetUrl}
                  onChange={handleChange}
                  isInvalid={!!errors.meetUrl}
                  errorMessage={errors.meetUrl}
                />
                <Input
                  name="startTime"
                  label="Start Time"
                  type="datetime-local"
                  value={
                    formData.startTime
                      ? new Date(formData.startTime).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleChange}
                  isInvalid={!!errors.startTime}
                  errorMessage={errors.startTime}
                />
                <Input
                  name="endTime"
                  label="End Time"
                  type="datetime-local"
                  value={
                    formData.endTime
                      ? new Date(formData.endTime).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleChange}
                  isInvalid={!!errors.endTime}
                  errorMessage={errors.endTime}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
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
