"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
  Switch,
} from "@nextui-org/react";
import { Video, Youtube } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  createWebinarApi,
  TCreateWebinarPayload,
} from "../../../../lib/apiClient";
import { AxiosError } from "axios";
import useAlert from "../../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useSRKFileUpload } from "@srk/shared/hooks";
import FileUpload from "../../../FileUplaod";

export default function CreateWebinarForm() {
  const [formData, setFormData] = useState({
    title: "",
    hasFinished: false,
    meetUrl: "",
    youtubeUrl: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploadingPercentage, setUploadingPercentage] = useState(0);
  const { show } = useAlert();
  const navigate = useNavigate();
  const { uploadFile } = useSRKFileUpload("university");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: TCreateWebinarPayload) => {
      return createWebinarApi(data);
    },
    onSuccess: () => {
      navigate("/admin/webinar");
      show("Webinar created successfully", "success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to create webinar", "error");
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!thumbnail) {
      show("Please upload a thumbnail image", "error");
      return;
    }

    const { key } = await uploadFile(thumbnail, "image", (progress) => {
      setUploadingPercentage(progress);
    });

    mutateAsync({
      title: formData.title,
      hasFinished: formData.hasFinished,
      meetUrl: formData.hasFinished ? undefined : formData.meetUrl,
      youtubeUrl: formData.hasFinished ? formData.youtubeUrl : undefined,
      thumbnail: key,
    });
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Webinar</h1>
        <p className="text-gray-200 mb-6">
          Set up a new webinar session for your participants
        </p>

        <Card>
          <CardHeader>
            <div className="flex gap-2 items-center text-lg font-semibold">
              <Video className="h-5 w-5" />
              Webinar Details
            </div>
          </CardHeader>

          <Divider />

          <CardBody as="form" onSubmit={handleSubmit} className="space-y-6">
            <Input
              isRequired
              type="text"
              label="Title"
              labelPlacement="outside"
              placeholder="Enter webinar title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />

            <FileUpload
              label="webinar thumbnail"
              onImageUpload={(file) => setThumbnail(file)}
              image={thumbnail}
            />

            <div className="flex items-center justify-between py-2 px-4 bg-default-100 rounded-lg">
              <div>
                <p className="font-medium">Webinar has finished</p>
                <p className="text-sm text-default-500">
                  Toggle on once the webinar is over to attach a YouTube
                  recording instead of a meeting link
                </p>
              </div>
              <Switch
                isSelected={formData.hasFinished}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, hasFinished: value }))
                }
                color="success"
              />
            </div>

            {formData.hasFinished ? (
              <Input
                isRequired
                type="url"
                label="YouTube URL"
                labelPlacement="outside"
                placeholder="https://youtube.com/watch?v=xxxx"
                value={formData.youtubeUrl}
                onChange={(e) =>
                  handleInputChange("youtubeUrl", e.target.value)
                }
                startContent={<Youtube className="w-4 h-4 text-default-500" />}
              />
            ) : (
              <Input
                isRequired
                type="url"
                label="Zoom / Google Meet URL"
                labelPlacement="outside"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={formData.meetUrl}
                onChange={(e) => handleInputChange("meetUrl", e.target.value)}
                startContent={<Video className="w-4 h-4 text-default-500" />}
              />
            )}

            <div className="flex gap-4">
              <Button
                color="primary"
                type="submit"
                fullWidth
                isLoading={isPending}
              >
                {uploadingPercentage > 0 && uploadingPercentage < 100
                  ? `Uploading thumbnail ${uploadingPercentage}%`
                  : "Create Webinar"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
