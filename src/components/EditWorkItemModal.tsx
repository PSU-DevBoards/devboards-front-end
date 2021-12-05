import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useOrganization } from '../contexts/organization-context';
import WorkitemService, {
  WorkItem,
  WorkItemStatus,
  WorkItemType,
} from '../services/workitem.service';
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
  const toast = useToast();
  const { organization } = useOrganization();
  const {
    isOpen: isDescOpen,
    onOpen: onDescOpen,
    onClose: onDescClose,
  } = useDisclosure();

  const getNiceItemType = () =>
    workItemType.charAt(0) + workItemType.slice(1).toLowerCase();

  const getModalTitle = () =>
    workItem
      ? `Edit ${workItemType.charAt(0)}-${workItem.id}`
      : `New ${getNiceItemType()}`;

  const onSubmitForm = ({
    name,
    description,
    status,
    estimate,
    priority,
  }: Record<string, string>) => {
    let toastTitle = `${getNiceItemType()} ${
      workItem ? 'modified' : 'created'
    }.`;
    let toastDescription = '';
    let toastStatus = 'success';

    const estimateInt = estimate ? parseInt(estimate, 10) : undefined;
    const priorityInt = parseInt(priority, 10);

    /* eslint-disable no-param-reassign */
    if (workItem) {
      workItem.name = name;
      workItem.priority = priorityInt;
      workItem.status = status as WorkItemStatus;
      workItem.description = description;
      workItem.estimate = estimateInt;

      WorkitemService.updateWorkItem(workItem.organizationId, workItem.id, {
        name,
        priority: priorityInt,
        description,
        status: status as WorkItemStatus,
        estimate: estimateInt,
      })
        .then(() => {
          toastDescription = `${getNiceItemType()} "${
            workItem.name
          }" successfully modified.`;

          onWorkItemSaved(workItem);
        })
        .catch(() => {
          toastTitle = `${getNiceItemType()} editing failed.`;
          toastDescription = `Error modifying ${getNiceItemType()} "${
            workItem.name
          }", try again later`;
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

      return;
    }

    const newWorkItem = {
      name,
      priority: priorityInt,
      description,
      status,
      type: workItemType,
      parentId,
      estimate: estimateInt,
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
      enableReinitialize: true,
      initialValues: {
        name: workItem ? workItem.name : '',
        status: workItem ? workItem.status : 'BACKLOG',
        description: workItem ? workItem.description! : '',
        estimate: workItem?.estimate ? workItem.estimate.toString() : '',
        priority: workItem?.priority ? workItem.priority.toString() : '1',
      },
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
              <VStack spacing={3}>
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
                {workItemType !== 'FEATURE' && (
                  <>
                    <FormControl isRequired>
                      <FormLabel htmlFor="status">Status</FormLabel>
                      <Select
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                    <FormControl>
                      <FormLabel>Priority</FormLabel>
                      <NumberInput
                        onChange={(priority) =>
                          setFieldValue('priority', priority)
                        }
                        onBlur={handleBlur}
                        value={parseInt(values.priority, 10)}
                        id="priority"
                        name="priority"
                        max={10}
                        min={1}
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
                <FormControl id="estimate">
                  <FormLabel>Estimate</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(estimate) => setFieldValue('estimate', estimate)}
                    onBlur={handleBlur}
                    value={
                      values.estimate
                        ? parseInt(values.estimate, 10)
                        : undefined
                    }
                    aria-label="Estimate Input"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <Button
                  w="full"
                  onClick={onDescOpen}
                  aria-label="open description helper"
                >
                  Description Helper
                </Button>
              </VStack>
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
              aria-label={`Submit ${workItem ? 'Edit' : 'Create'}`}
            >
              {workItem ? 'Edit' : 'Create'}
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
