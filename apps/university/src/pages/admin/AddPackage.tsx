import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import PackageTable from "../../components/admin/package/PackageTable";
import { PrimaryButton } from "../../components/ReusableComponents";
import { AddPackageForm } from "../../components/admin/package/PackageForm";

export const AddPackage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Packages</h1>
        <PrimaryButton onclick={handleOpen} label="Add New Package" />
        {/* <Button onPress={handleOpen}>Add New Package</Button> */}
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Add Packages
                </ModalHeader>
                <ModalBody>
                  <AddPackageForm onClose={onClose} />
                </ModalBody>
                {/* <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter> */}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <PackageTable />
    </div>
  );
};
