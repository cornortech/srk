import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { ReactElement } from "react";

type ConfirmationModalProps = {
  onConfirm: () => void;
  title?: string;
  message?: string;
  trigger: ReactElement; // specifically ReactElement to clone with onClick
};

const ConfirmationModal = ({
  onConfirm,
  title = "Confirmation",
  message = "Are you sure you want to proceed with this action? This action cannot be undone.",
  trigger,
}: ConfirmationModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: onOpen, // bind modal open to trigger button
      })}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
