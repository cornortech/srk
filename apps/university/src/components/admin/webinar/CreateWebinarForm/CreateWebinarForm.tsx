"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
  Divider,
} from "@nextui-org/react";
import { CalendarIcon, Video, Clock, FileText } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  createWebinarApi,
  TCreateWebinarPayload,
} from "../../../../lib/apiClient";
import { AxiosError } from "axios";
import useAlert from "../../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

export default function CreateWebinarForm() {
  const [formData, setFormData] = useState({
    meetUrl: "",
    startDateTime: "",
    endDateTime: "",
    purpose: "",
  });
  const { show } = useAlert();
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: TCreateWebinarPayload) => {
      return createWebinarApi(data);
    },
    onSuccess: (data) => {
      console.log("Webinar created successfully:", data);
      // Optionally reset form or show success message
      navigate("/admin/webinar");
      show("Webinar created successfully", "success");
      setFormData({
        meetUrl: "",
        startDateTime: "",
        endDateTime: "",
        purpose: "",
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating webinar:", error);
      // Optionally show error message
      show("Failed to create webinar: ", "error");
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutateAsync({
      meetUrl: formData.meetUrl,
      startTime: new Date(formData.startDateTime),
      endTime: new Date(formData.endDateTime),
      title: formData.purpose,
    });
    console.log("Webinar Data:", formData);
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
            {/* Meet URL */}
            <Input
              isRequired
              type="url"
              label="Google Meet URL"
              labelPlacement="outside"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={formData.meetUrl}
              onChange={(e) => handleInputChange("meetUrl", e.target.value)}
              startContent={<Video className="w-4 h-4 text-default-500" />}
            />
            {/* Date/Time Grid using Tailwind */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                isRequired
                type="datetime-local"
                label="Start Date & Time"
                labelPlacement="outside"
                value={formData.startDateTime}
                onChange={(e) =>
                  handleInputChange("startDateTime", e.target.value)
                }
                startContent={
                  <CalendarIcon className="w-4 h-4 text-default-500" />
                }
              />
              <Input
                isRequired
                type="datetime-local"
                label="End Date & Time"
                labelPlacement="outside"
                value={formData.endDateTime}
                onChange={(e) =>
                  handleInputChange("endDateTime", e.target.value)
                }
                startContent={<Clock className="w-4 h-4 text-default-500" />}
              />
            </div>
            {/* Purpose */}
            <Textarea
              isRequired
              label="Purpose of Webinar"
              labelPlacement="outside"
              placeholder="Describe the purpose, agenda, and key topics..."
              value={formData.purpose}
              onChange={(e) => handleInputChange("purpose", e.target.value)}
              startContent={<FileText className="w-4 h-4 text-default-500" />}
              minRows={4}
            />
            <div className="flex gap-4">
              <Button color="primary" type="submit" fullWidth>
                Create Webinar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Preview Section */}
        {(formData.meetUrl || formData.purpose) && (
          <Card className="mt-8">
            <CardHeader>
              <div className="text-lg font-semibold">Preview</div>
            </CardHeader>
            <Divider />
            <CardBody>
              {formData.purpose && (
                <div className="mb-4">
                  <h4 className="font-semibold">Webinar Purpose</h4>
                  <p className="text-sm text-gray-600">{formData.purpose}</p>
                </div>
              )}
              {formData.startDateTime && formData.endDateTime && (
                <div className="mb-4">
                  <h4 className="font-semibold">Schedule</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(formData.startDateTime).toLocaleString()} –{" "}
                    {new Date(formData.endDateTime).toLocaleString()}
                  </p>
                </div>
              )}
              {formData.meetUrl && (
                <div>
                  <h4 className="font-semibold">Meeting Link</h4>
                  <p className="text-sm text-blue-600 break-all">
                    {formData.meetUrl}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
