import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  FormHelperText,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import WorkitemService, {
  WorkItem,
  WorkItemType,
} from '../services/workitem.service';
import { useOrganization } from '../contexts/organization-context';
import DescriptionHelperModal from './DescriptionHelperModal';

function EditWorkItemModal({
  isOpen,
  onClose,
  onWorkItemSaved,
  workItemType,
  workItem,
  parentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onWorkItemSaved: (workItem: WorkItem) => void;
  workItemType: WorkItemType;
  workItem?: WorkItem;
  parentId?: number;
}) {
  const { organization } = useOrganization();
  const [itemPriority, setPriority] = useState(0);
  const toast = useToast();
  const {
    isOpen: isDescOpen,
    onOpen: onDescOpen,
    onClose: onDescClose,
  } = useDisclosure();

  const getNiceItemType = () =>
    workItemType.charAt(0) + workItemType.slice(1).toLowerCase();

  const getModalTitle = () =>
    workItem ? `Edit F-${workItem.id}` : `New ${getNiceItemType()}`;

  const onSubmitForm = ({
    name,
    description,
    status,
  }: Record<string, string>) => {
    let toastTitle = `${getNiceItemType()} created.`;
    let toastDescription = '';
    let toastStatus = 'success';

    const newWorkItem = {
      name,
      priority: itemPriority,
      description,
      status,
      type: workItemType,
      parentId,
    };

    WorkitemService.createWorkItem(organization?.id!, newWorkItem)
      .then((item) => {
        toastDescription = `${getNiceItemType()} "${
          item.name
        }" successfully created.`;

        onWorkItemSaved(item);
      })
      .catch(() => {
        toastTitle = `${getNiceItemType()} creation failed.`;
        toastDescription = `Error creating ${getNiceItemType()} "${name}", try again later`;
        toastStatus = 'error';
      })
      .finally(() => {
        toast({
          position: 'bottom-right',
          title: toastTitle,
          description: toastDescription,
          status: toastStatus as any,
          duration: 5000,
          isClosable: false,
        });

        onClose();
      });
  };

  const { handleSubmit, handleChange, handleBlur, values, setFieldValue } =
    useFormik({
      initialValues: { name: '', status: 'BACKLOG', description: '' },
      onSubmit: onSubmitForm,
    });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader aria-label="Edit Work Item Header">
            {getModalTitle()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="create_feature_form" onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                />
              </FormControl>
              <br />
              {workItemType !== 'FEATURE' && (
                <>
                  <FormControl isRequired>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Select
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue="BACKLOG"
                      name="status"
                      id="status"
                      value={values.status}
                    >
                      <option value="BACKLOG">Backlog</option>
                      <option value="READY">Ready</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="VERIFY">Verify</option>
                      <option value="DONE">Done</option>
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <NumberInput
                      onChange={(priority) =>
                        setPriority(parseInt(priority, 10))
                      }
                      onBlur={handleBlur}
                      id="priority"
                      name="priority"
                      defaultValue={1}
                      max={10}
                      min={1}
                      value={itemPriority}
                      aria-label="Priority Input"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper aria-label="Priority Increment" />
                        <NumberDecrementStepper aria-label="Priority Decrement" />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      Lower number signifies a higher priority
                    </FormHelperText>
                  </FormControl>
                  <br />
                </>
              )}

              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Textarea
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={values.description}
                />
              </FormControl>
              <Button
                mt={6}
                w="full"
                onClick={onDescOpen}
                aria-label="open description helper"
              >
                Description Helper
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              form="create_feature_form"
              type="submit"
              colorScheme="purple"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DescriptionHelperModal
        isOpen={isDescOpen}
        onClose={onDescClose}
        onSubmit={(text) => setFieldValue('description', text)}
        template="RFB"
      />
    </>
  );
}

export default EditWorkItemModal;
