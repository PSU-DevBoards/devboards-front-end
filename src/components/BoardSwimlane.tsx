import {
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  ButtonGroup,
  IconButton,
  useEditableControls,
  useToast,
  UseToastOptions,
  useDisclosure
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { BiCheck, BiX, BiEdit, BiPlus } from 'react-icons/bi';
import Board from 'react-trello';
import buildBoardData from '../helpers/board.helper';
import EditWorkItemModal from './EditWorkItemModal';
import WorkitemService, { WorkItem, WorkItemStatus } from '../services/workitem.service';

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
        aria-label="Submit changes"
        icon={<BiCheck />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label="Cancel changes"
        icon={<BiX />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <IconButton
      marginLeft="10px"
      aria-label="Edit feature name"
      size="sm"
      icon={<BiEdit />}
      {...getEditButtonProps()}
    />
  );
}

function BoardSwimlane({ parent }: { parent: WorkItem }) {
  const [children, setChildren] = useState<Array<WorkItem>>([]);
  const toast = useToast();
  const {
    isOpen: isEditItemOpen,
    onOpen: onOpenEditItem,
    onClose: onCloseEditItem,
  } = useDisclosure();

  useEffect(() => {
    if( parent.organizationId ){
      WorkitemService.getWorkItems(parent.organizationId, {
        parentId: parent.id,
      }).then((data) => {
        setChildren(data);
      });
    }
  }, []);

  const getBoardData = useCallback(() => buildBoardData(children), [children]);

  const handleCardMove = (cardId: string, fromLaneId: string, toLaneId: string, addedIndex: number) => {
    if( fromLaneId === toLaneId ) return;

    WorkitemService.updateWorkItem(parent.organizationId, parseInt(cardId, 10), {
      status: toLaneId as WorkItemStatus
    });

    console.log(`${cardId} ${fromLaneId} ${toLaneId} ${addedIndex}`);
    
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onWorkItemSaved = (workItem: WorkItem) => { }

  return (
    <AccordionItem>
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
                onSubmit={(newName) => {
                  const toastData: UseToastOptions = {
                    position: 'bottom-right',
                    status: 'success',
                    title: 'Work item modified',
                  };

                  WorkitemService.updateWorkItem(parent.organizationId, parent.id, {
                    name: newName
                  })
                  .then(() => {
                    toastData.description = `Feature name changed to: "${newName}".`;
                  })
                  .catch((err) => {
                    toastData.status = 'error';
                    toastData.description = "Feature modifications failed!";

                    if( err.errors ){
                      const [errorMessages] = err.errors;
                      toastData.description = errorMessages;
                    }
                  })
                  .finally(() => {
                    toast(toastData);
                  });
                }}
              >
                <Flex alignItems="center">
                  <EditablePreview />
                  <EditableInput />
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
        />
        <Flex justifyContent='flex-end'>
          <ButtonGroup size="md" isAttached variant="outline" onClick={onOpenEditItem}>
            <Button mr="-px">
              Add Story
            </Button>
            <IconButton aria-label="Add Story" icon={<BiPlus />} />
          </ButtonGroup>
        </Flex>
        <EditWorkItemModal
          workItemType="STORY"
          isOpen={isEditItemOpen}
          onWorkItemSaved={onWorkItemSaved}
          onClose={onCloseEditItem}
          parentId={parent.id}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

export default BoardSwimlane;
