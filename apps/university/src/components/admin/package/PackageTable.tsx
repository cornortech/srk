import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Trash } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePackageApi, getAllPackagesApi } from "../../../lib/apiClient";
import { TPackage } from "../../../lib/types/entities";
import useAlert from "../../../hooks/useAlert";
import { AxiosError } from "axios";

export default function PackageTable() {
  const [packages, setPackages] = useState<TPackage[]>([]);
  const [editingPackage, setEditingPackage] = useState<TPackage | null>(null);
  const { isOpen: isEditModalOpen, onClose: closeEditModal } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const { show } = useAlert();
  const { data: packagesData, refetch: refetchPackages } = useQuery<
    TPackage[] | undefined
  >({
    queryKey: ["packages"],
    queryFn: async () => {
      const data = await getAllPackagesApi();
      return data;
    },
  });

  const { mutate: deletePackageMutation } = useMutation({
    mutationFn: async (data: { packageId: string }) => {
      const res = await deletePackageApi(data.packageId);
      return res;
    },
    onSuccess: () => {
      refetchPackages();
      show("Package deleted successfully", "success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      show(error.response?.data.message || "Failed to delete package", "error");
    },
  });

  // const handleEdit = (pkg: TPackage) => {
  //   setEditingPackage(pkg);
  //   openEditModal();
  // };

  const handleDelete = (id: string) => {
    setPackageToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (packageToDelete) {
      deletePackageMutation({
        packageId: packageToDelete,
      });
      if (packages) {
        setPackages(packages.filter((pkg) => pkg._id !== packageToDelete));
      }
      closeDeleteModal();
      setPackageToDelete(null);
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages(
        packages.map((pkg) =>
          pkg._id === editingPackage._id ? editingPackage : pkg
        )
      );
      closeEditModal();
      setEditingPackage(null);
      refetchPackages();
    }
  };

  if (!packagesData) {
    return <div></div>;
  }
  return (
    <>
      <Table aria-label="Package table">
        <TableHeader>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>DISCOUNTED PRICE</TableColumn>

          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {packagesData.map((pkg) => (
            <TableRow key={pkg._id}>
              <TableCell>{pkg.createdAt?.toLocaleString()}</TableCell>
              <TableCell>{pkg.title}</TableCell>
              <TableCell>
                {pkg.currency} {pkg.price}
              </TableCell>
              <TableCell>
                {pkg.currency} {pkg.discountedPrice}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* <Button
                    isIconOnly
                    size="sm"
                    // color="primary"
                    className="bg-green-600"
                    onPress={() => handleEdit(pkg)}
                    radius="sm"
                  >
                    <Edit size={16} />
                  </Button> */}
                  <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    // color="danger"
                    className="bg-red-500"
                    onPress={() => handleDelete(pkg._id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleEditSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Edit Package
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  value={editingPackage?.title || ""}
                  onChange={(e) =>
                    setEditingPackage((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                />
                <Input
                  label="Price"
                  type="number"
                  value={editingPackage?.price.toString() || "0"}
                  onChange={(e) =>
                    setEditingPackage((prev) =>
                      prev ? { ...prev, price: Number(e.target.value) } : null
                    )
                  }
                />
                <Textarea
                  label="Description"
                  value={editingPackage?.description || ""}
                  onChange={(e) =>
                    setEditingPackage((prev) =>
                      prev ? { ...prev, description: e.target.value } : null
                    )
                  }
                />
                {/* Add more fields as needed */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this package? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
