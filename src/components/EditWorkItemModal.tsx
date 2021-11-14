import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import { WorkItem, WorkItemType } from '../services/workitem.service';

function EditWorkItemModal({
  isOpen,
  onClose,
  workItemType,
  workItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  workItemType: WorkItemType;
  workItem?: WorkItem;
}) {
  const getModalTitle = () =>
    workItem ? `Edit F-${workItem.id}` : `New ${workItemType}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getModalTitle()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>TEST</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="ghost">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditWorkItemModal;
