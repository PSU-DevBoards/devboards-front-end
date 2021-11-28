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
    if (fromLaneId !== toLaneId) {
      const itemId = parseInt(cardId, 10);

      WorkitemService.updateWorkItem(parent.organizationId, itemId, {
        status: toLaneId as WorkItemStatus,
      }).then(() => {
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
  
  const onWorkItemSaved = (workItem: WorkItem) => {
    setChildren([...children, workItem]);
  };

  const onCardEdit = (cardId: string) => {
    WorkitemService.getWorkItem(parent.organizationId, parseInt(cardId, 10))
    .then((workItem: WorkItem) => {
      setWorkItem(workItem);
      onOpenEditItem();
    });
  }
  
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
        toastData.description = `Feature name changed to: "${name}".`;
      })
      .catch((err) => {
        toastData.status = 'error';
        toastData.title = 'Feature modifications failed!';

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
        />
        <Flex justifyContent="flex-end">
          <Button
            variant="outline"
            onClick={onOpenNewItem}
            rightIcon={<BiPlus />}
          >
            Add {parent.type === 'FEATURE' ? 'Story' : 'Task'}
          </Button>
        </Flex>
        <EditWorkItemModal
          workItemType={parent.type === 'FEATURE' ? 'STORY' : 'TASK'}
          isOpen={isNewItemOpen}
          onWorkItemSaved={onWorkItemSaved}
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
