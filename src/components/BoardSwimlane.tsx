import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useEditableControls,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiCheck, BiEdit, BiPlus, BiX } from 'react-icons/bi';
import Board from 'react-trello';
import buildBoardData from '../helpers/board.helper';
import WorkitemService, {
  WorkItem,
  WorkItemStatus,
} from '../services/workitem.service';
import EditWorkItemModal from './EditWorkItemModal';

/* Controls for modifying work item name in accordion header */
function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup size="sm">
      <IconButton
        aria-label="Submit Changes"
        icon={<BiCheck />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label="Cancel Changes"
        icon={<BiX />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <IconButton
      marginLeft="10px"
      aria-label="Edit Feature Name"
      size="sm"
      icon={<BiEdit />}
      {...getEditButtonProps()}
    />
  );
}

function BoardSwimlane({ parent }: { parent: WorkItem }) {
  const [children, setChildren] = useState<Array<WorkItem>>([]);
  const [activeWorkItem, setWorkItem] = useState({} as WorkItem);
  const toast = useToast();
  const {
    isOpen: isNewItemOpen,
    onOpen: onOpenNewItem,
    onClose: onCloseNewItem,
  } = useDisclosure();
  const {
    isOpen: isEditItemOpen,
    onOpen: onOpenEditItem,
    onClose: onCloseEditItem,
  } = useDisclosure();

  useEffect(() => {
    WorkitemService.getWorkItems(parent.organizationId, {
      parentId: parent.id,
    }).then(setChildren);
  }, []);

  const getBoardData = useCallback(() => buildBoardData(children), [children]);

  // TODO: Find a proper way to test this
  /* istanbul ignore next */
  const handleCardMove = (
    cardId: string,
    fromLaneId: string,
    toLaneId: string
  ) => {
    /* Only send request if card moved to separate lane */
    if (fromLaneId !== toLaneId) {
      const itemId = parseInt(cardId, 10);

      /* Send PATCH request to backend */
      WorkitemService.updateWorkItem(parent.organizationId, itemId, {
        status: toLaneId as WorkItemStatus,
      }).then(() => {
        /* Update cards to reflect changes when request successful */
        setChildren(
          children.map((item) =>
            item.id === itemId
              ? { ...item, status: toLaneId as WorkItemStatus }
              : item
          )
        );
      });
    }
  };

  /* Update board state when work item created */
  const onWorkItemCreated = (workItem: WorkItem) => {
    setChildren([...children, workItem]);
  };

  /* Update board state when work item saved */
  const onWorkItemSaved = (workItem: WorkItem) =>
    setChildren(
      children.map((child) => (child.id === workItem.id ? workItem : child))
    );

  /* Update board state when work item deleted */
  const onWorkItemDeleted = (workItem: WorkItem) =>
    setChildren(children.filter((child) => child.id !== workItem.id));

  const onCardEdit = (cardId: string) => {
    /* Get work item data to prefill editing modal window */
    WorkitemService.getWorkItem(parent.organizationId, parseInt(cardId, 10))
      .then((workItem: WorkItem) => {
        setWorkItem(workItem);
        onOpenEditItem();
      })
      .catch(() => {
        /* Provide error on failure */
        const toastData: UseToastOptions = {
          position: 'bottom-right',
          status: 'error',
          title: 'Work item modifications failed!',
        };
        toast(toastData);
      });
  };

  /* Handle deletion of cards after pressing 'x' button */
  const onCardDelete = (cardId: string) => {
    const toastData: UseToastOptions = {
      position: 'bottom-right',
      status: 'error',
      title: 'Work item deletion failed!',
    };

    WorkitemService.getWorkItem(parent.organizationId, parseInt(cardId, 10))
      .then((workItem: WorkItem) => {
        WorkitemService.deleteWorkItem(
          parent.organizationId,
          parseInt(cardId, 10)
        )
          .then(() => {
            toastData.status = 'success';
            toastData.title = 'Work item successfully deleted.';
            onWorkItemDeleted(workItem);
          })
          .finally(() => toast(toastData));
      })
      .catch(() => toast(toastData));
  };

  /* Handle submission of edited work item */
  const onSubmitEditable = (name: string) => {
    const toastData: UseToastOptions = {
      position: 'bottom-right',
      status: 'success',
      title: 'Work item modified',
    };

    WorkitemService.updateWorkItem(parent.organizationId, parent.id, {
      name,
    })
      .then(() => {
        toastData.description = `Work item name changed to: "${name}".`;
      })
      .catch((err) => {
        toastData.status = 'error';
        toastData.title = 'Work item modifications failed!';

        if (err.errors) {
          const [errorMessages] = err.errors;
          toastData.description = errorMessages;
        }
      })
      .finally(() => {
        toast(toastData);
      });
  };

  return (
    <AccordionItem data-testid={`swimlane-${parent.id}`}>
      <h2>
        <AccordionButton as="div">
          <Box flex="1" textAlign="left">
            <Flex flexDirection="row" alignItems="baseline">
              <Text
                fontWeight="500"
                fontSize="lg"
                marginRight="5px"
                isTruncated
              >
                {`${parent.type[0]}-${parent.id}`}
              </Text>
              <Editable
                fontWeight="400"
                fontSize="lg"
                defaultValue={parent.name}
                isPreviewFocusable={false}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onSubmit={onSubmitEditable}
              >
                <Flex alignItems="center">
                  <EditablePreview />
                  <EditableInput aria-label="Feature Name" />
                  <EditableControls />
                </Flex>
              </Editable>
            </Flex>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Board
          style={{ backgroundColor: 'white', height: 'auto' }}
          data={getBoardData()}
          handleDragEnd={handleCardMove}
          onCardClick={onCardEdit}
          onCardDelete={onCardDelete}
          aria-label="Scrum Board"
        />
        <Flex justifyContent="flex-end">
          <Button
            variant="outline"
            onClick={onOpenNewItem}
            rightIcon={<BiPlus />}
            aria-label={`Add ${parent.type === 'FEATURE' ? 'Story' : 'Task'}`}
          >
            Add {parent.type === 'FEATURE' ? 'Story' : 'Task'}
          </Button>
        </Flex>
        <EditWorkItemModal
          workItemType={parent.type === 'FEATURE' ? 'STORY' : 'TASK'}
          isOpen={isNewItemOpen}
          onWorkItemSaved={onWorkItemCreated}
          onClose={onCloseNewItem}
          parentId={parent.id}
        />
        <EditWorkItemModal
          workItemType={parent.type === 'FEATURE' ? 'STORY' : 'TASK'}
          isOpen={isEditItemOpen}
          onWorkItemSaved={onWorkItemSaved}
          onClose={onCloseEditItem}
          parentId={parent.id}
          workItem={activeWorkItem}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

export default BoardSwimlane;
