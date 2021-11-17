import {
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  ButtonGroup,
  IconButton,
  useEditableControls,
  useToast,
  UseToastOptions
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { BiCheck, BiX, BiEdit } from 'react-icons/bi';
import Board from 'react-trello';
import buildBoardData from '../helpers/board.helper';
import WorkitemService, { WorkItem } from '../services/workitem.service';

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
  
  useEffect(() => {
    if( parent.organizationId ){
      WorkitemService.getWorkItems(parent.organizationId, {
        parentId: parent.id,
      }).then(setChildren);
    }
  }, []);

  const getBoardData = useCallback(() => buildBoardData(children), [children]);

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

                  /* eslint-disable no-param-reassign */
                  parent.name = newName;
                  console.log(parent);
                  WorkitemService.updateWorkItem(parent.organizationId, parent.id, parent)
                  .then(() => {
                    toastData.description = `Feature name changed to: "${newName}".`;
                  })
                  .catch((err) => {
                    console.log();
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
        />
      </AccordionPanel>
    </AccordionItem>
  );
}

export default BoardSwimlane;
