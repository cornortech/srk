"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSRKFileUpload } from "@srk/shared/hooks";
import { rewardApi } from "../../lib/api/reward/reward.api";
import { getUniversityAssetUrl } from "../../lib/cdn";
import useAlert from "../../hooks/useAlert";
import FileUpload from "../../components/FileUplaod";

export default function AdminRewards() {
  const { show } = useAlert();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { uploadFile } = useSRKFileUpload("university");

  const [rewardsPage, setRewardsPage] = useState(1);
  const [claimsPage, setClaimsPage] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredEarning, setRequiredEarning] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploadingPercentage, setUploadingPercentage] = useState(0);

  const { data: rewards, refetch: refetchRewards } = useQuery({
    queryKey: ["adminRewards", rewardsPage],
    queryFn: () => rewardApi.getAllRewards(rewardsPage),
  });

  const { data: claims } = useQuery({
    queryKey: ["adminRewardClaims", claimsPage],
    queryFn: () => rewardApi.getRewardClaims(claimsPage),
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRequiredEarning("");
    setPhoto(null);
    setUploadingPercentage(0);
  };

  const { mutateAsync: createReward, isPending: isCreating } = useMutation({
    mutationFn: rewardApi.createReward,
    onSuccess: () => {
      show("Reward created successfully", "success");
      refetchRewards();
      resetForm();
      onClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to create reward", "error");
    },
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: rewardApi.toggleRewardActive,
    onSuccess: () => refetchRewards(),
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to update reward", "error");
    },
  });

  const handleCreate = async () => {
    const earning = Number(requiredEarning);
    if (!title.trim() || !description.trim() || !photo) {
      show("Title, description and photo are required", "error");
      return;
    }
    if (!earning || earning < 1) {
      show("Earning must be at least 1", "error");
      return;
    }
    try {
      const { key } = await uploadFile(photo, "image", setUploadingPercentage);
      await createReward({
        title: title.trim(),
        description: description.trim(),
        photoUrl: key,
        requiredEarning: earning,
      });
    } catch (error) {
      console.error("Reward photo upload failed", error);
      show("Failed to upload photo. Please try again.", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Rewards</h1>
          <p className="text-sm text-gray-200">
            Create rewards and contact users who claimed them
          </p>
        </div>
        <Button color="primary" size="sm" onPress={onOpen}>
          Add Reward
        </Button>
      </div>

      <Tabs aria-label="Rewards" className="mb-4">
        <Tab key="claims" title="Claims">
          <Table
            aria-label="Reward claims"
            bottomContent={
              claims && claims.totalPages > 1 ? (
                <div className="flex justify-center">
                  <Pagination
                    page={claimsPage}
                    total={claims.totalPages}
                    onChange={setClaimsPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>SN</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Reward</TableColumn>
              <TableColumn>Earning</TableColumn>
              <TableColumn>Claimed</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No reward claims yet">
              {(claims?.data ?? []).map((claim, index) => (
                <TableRow key={claim._id}>
                  <TableCell>{(claimsPage - 1) * 10 + index + 1}</TableCell>
                  <TableCell>{claim.user.fullName}</TableCell>
                  <TableCell>{claim.user.phoneNumber}</TableCell>
                  <TableCell>{claim.user.email}</TableCell>
                  <TableCell>{claim.rewardTitle}</TableCell>
                  <TableCell>
                    {claim.earningAtClaim.toLocaleString()} /{" "}
                    {claim.requiredEarning.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(claim.claimedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>

        <Tab key="rewards" title="All Rewards">
          <Table
            aria-label="All rewards"
            bottomContent={
              rewards && rewards.totalPages > 1 ? (
                <div className="flex justify-center">
                  <Pagination
                    page={rewardsPage}
                    total={rewards.totalPages}
                    onChange={setRewardsPage}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn>SN</TableColumn>
              <TableColumn>Photo</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Earning Required</TableColumn>
              <TableColumn>Claims</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Created</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No rewards created yet">
              {(rewards?.data ?? []).map((reward, index) => (
                <TableRow key={reward._id}>
                  <TableCell>{(rewardsPage - 1) * 10 + index + 1}</TableCell>
                  <TableCell>
                    <Image
                      src={getUniversityAssetUrl(reward.photoUrl)}
                      alt={reward.title}
                      className="w-20 h-12 object-cover"
                      width={80}
                      height={48}
                    />
                  </TableCell>
                  <TableCell>{reward.title}</TableCell>
                  <TableCell>{reward.requiredEarning.toLocaleString()}</TableCell>
                  <TableCell>{reward.claimCount}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={reward.isActive ? "success" : "default"}
                    >
                      {reward.isActive ? "Active" : "Disabled"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => toggleActive(reward._id)}
                    >
                      {reward.isActive ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Add Reward</ModalHeader>
              <ModalBody className="space-y-3">
                <Input
                  isRequired
                  label="Title"
                  labelPlacement="outside"
                  placeholder="Reward title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  isRequired
                  type="number"
                  min={1}
                  label="Earning to complete"
                  labelPlacement="outside"
                  placeholder="e.g. 50000"
                  value={requiredEarning}
                  onChange={(e) => setRequiredEarning(e.target.value)}
                />
                <Textarea
                  isRequired
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Describe the reward"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <FileUpload
                  label="reward photo"
                  onImageUpload={setPhoto}
                  image={photo}
                />
                {uploadingPercentage > 0 && uploadingPercentage < 100 && (
                  <p className="text-sm text-center">
                    Uploading photo {uploadingPercentage}%
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    resetForm();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isCreating}
                  onPress={handleCreate}
                >
                  Create Reward
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
