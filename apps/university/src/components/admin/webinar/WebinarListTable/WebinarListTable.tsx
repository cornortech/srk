"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Image,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
  deleteWebinarApi,
  getAllWebinarsApi,
  updateWebinarApi,
} from "../../../../lib/apiClient";
import { TWebinar } from "../../../../lib/types/entities";
import { getUniversityAssetUrl } from "../../../../lib/cdn";
import ConfirmationModal from "../../modal/ConfirmationModal";
import { AxiosError } from "axios";
import useAlert from "../../../../hooks/useAlert";
import UpdateWebinarModal from "../../modal/UpdateWebinarModal";
import { Link } from "react-router-dom";

export default function AdminWebinarList() {
  const { data: webinarList, refetch: refetchWebinar } = useQuery<TWebinar[]>({
    queryKey: ["webinars"],
    queryFn: async () => {
      return getAllWebinarsApi();
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  const { show } = useAlert();

  const { mutateAsync: mutateUpdateWebinar } = useMutation({
    mutationKey: ["updateWebinar"],
    mutationFn: async (webinarData: TWebinar) => {
      await updateWebinarApi(webinarData, webinarData._id);
      refetchWebinar();
      return webinarData;
    },
    onSuccess: () => {
      // Show success message or update state
      show("Webinar updated successfully", "success");
      refetchWebinar();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Handle error, show error message
      show(error.response?.data.message || "Failed to update webinar", "error");
      console.error("Error updating webinar.", error.response?.data.message);
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["deleteWebinar"],
    mutationFn: async (webinarId: string) => {
      await deleteWebinarApi(webinarId);
    },
    onSuccess: () => {
      // Show success message or update state
      show("Webinar deleted successfully", "success");
      refetchWebinar();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // Handle error, show error message
      show(error.response?.data.message || "Failed to delete webinar", "error");
      console.error("Error deleting webinar.", error.response?.data.message);
    },
  });

  const handleDeleteWebinar = async (webinarId: string) => {
    mutateAsync(webinarId);
  };
  if (!webinarList) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Loading webinars...</h1>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/*  */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">All Webinars</h1>
          <p className="text-sm text-gray-200 mb-6">
            Manage all scheduled webinars from here
          </p>
        </div>
        <Link to={"/admin/webinar/create"}>
        <Button color="primary" size="sm" href="/admin/webinar/add">
          Add New Webinar
        </Button>
        </Link>
      </div>

      {/*  */}
      <Table aria-label="Admin webinar list">
        <TableHeader>
          <TableColumn>SN</TableColumn>
          <TableColumn>Thumbnail</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Link</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody>
          {webinarList?.map((webinar, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Image
                  src={getUniversityAssetUrl(webinar.thumbnail)}
                  alt={webinar.title}
                  className="w-20 h-12 object-cover"
                  width={80}
                  height={48}
                />
              </TableCell>
              <TableCell>{webinar.title}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={webinar.hasFinished ? "default" : "primary"}
                  variant="flat"
                >
                  {webinar.hasFinished ? "Finished" : "Upcoming"}
                </Chip>
              </TableCell>
              <TableCell>
                <a
                  href={webinar.hasFinished ? webinar.youtubeUrl : webinar.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {(webinar.hasFinished ? webinar.youtubeUrl : webinar.meetUrl) ||
                    "No URL provided"}
                </a>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdateWebinarModal
                    webinar={webinar}
                    onUpdate={(updatedData) => {
                      mutateUpdateWebinar(updatedData);
                    }}
                    trigger={
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    }
                  />

                  <ConfirmationModal
                    message="Are you sure you want to delete this webinar? This action cannot be undone."
                    onConfirm={async () => {
                      await handleDeleteWebinar(webinar._id);
                    }}
                    title="Delete Webinar"
                    trigger={
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
