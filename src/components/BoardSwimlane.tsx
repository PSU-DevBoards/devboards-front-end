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
    <ButtonGroup size="xs">
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
      size="xs"
      icon={<BiEdit />}
      {...getEditButtonProps()}
    />
  );
}

function BoardSwimlane({ parent }: { parent: WorkItem }) {
  const [children, setChildren] = useState<Array<WorkItem>>([]);

  useEffect(() => {
    WorkitemService.listWorkItems(parent.organization_id, {
      parent_id: parent.id,
    }).then(setChildren);
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
              >
                <EditablePreview />
                <EditableInput />
                <EditableControls />
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
